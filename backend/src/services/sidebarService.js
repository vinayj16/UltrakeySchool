import SidebarPreference from '../models/SidebarPreference.js';
import MenuCustomization from '../models/MenuCustomization.js';

class SidebarService {
  async getUserPreferences(userId, schoolId) {
    let preferences = await SidebarPreference.findOne({ userId, schoolId });
    
    if (!preferences) {
      preferences = await SidebarPreference.create({
        userId,
        schoolId,
        isCollapsed: false,
        pinnedItems: [],
        recentItems: [],
        bookmarks: [],
        quickActions: this.getDefaultQuickActions(),
        hiddenMenuItems: [],
        expandedMenus: ['dashboards'],
        maxRecentItems: 5,
        showQuickActions: true,
        showRecentItems: true,
        showBookmarks: true
      });
    }
    
    return preferences;
  }

  async updatePreferences(userId, schoolId, updates) {
    const preferences = await SidebarPreference.findOneAndUpdate(
      { userId, schoolId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    
    return preferences;
  }

  async toggleCollapsed(userId, schoolId, isCollapsed) {
    return await this.updatePreferences(userId, schoolId, { isCollapsed });
  }

  async addRecentItem(userId, schoolId, item) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    return await preferences.addRecentItem(item);
  }

  async clearRecentItems(userId, schoolId) {
    return await this.updatePreferences(userId, schoolId, { recentItems: [] });
  }

  async addBookmark(userId, schoolId, bookmark) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    return await preferences.addBookmark(bookmark);
  }

  async removeBookmark(userId, schoolId, bookmarkId) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    return await preferences.removeBookmark(bookmarkId);
  }

  async updateBookmarkOrder(userId, schoolId, bookmarks) {
    return await this.updatePreferences(userId, schoolId, { bookmarks });
  }

  async addQuickAction(userId, schoolId, action) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    
    const exists = preferences.quickActions.some(a => a.id === action.id);
    if (!exists) {
      preferences.quickActions.push({
        ...action,
        order: preferences.quickActions.length
      });
      await preferences.save();
    }
    
    return preferences;
  }

  async removeQuickAction(userId, schoolId, actionId) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    preferences.quickActions = preferences.quickActions.filter(a => a.id !== actionId);
    await preferences.save();
    return preferences;
  }

  async toggleQuickAction(userId, schoolId, actionId, enabled) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    return await preferences.toggleQuickAction(actionId, enabled);
  }

  async updateQuickActionOrder(userId, schoolId, quickActions) {
    return await this.updatePreferences(userId, schoolId, { quickActions });
  }

  async updateExpandedMenus(userId, schoolId, expandedMenus) {
    return await this.updatePreferences(userId, schoolId, { expandedMenus });
  }

  async hideMenuItem(userId, schoolId, menuItemId) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    
    if (!preferences.hiddenMenuItems.includes(menuItemId)) {
      preferences.hiddenMenuItems.push(menuItemId);
      await preferences.save();
    }
    
    return preferences;
  }

  async showMenuItem(userId, schoolId, menuItemId) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    preferences.hiddenMenuItems = preferences.hiddenMenuItems.filter(id => id !== menuItemId);
    await preferences.save();
    return preferences;
  }

  async getMenuCustomization(schoolId, role) {
    let customization = await MenuCustomization.findOne({ schoolId, role, isActive: true });
    
    if (!customization) {
      customization = await MenuCustomization.create({
        schoolId,
        role,
        menuItems: this.getDefaultMenuItems(role),
        customMenuItems: [],
        hiddenSections: [],
        isActive: true
      });
    }
    
    return customization;
  }

  async updateMenuCustomization(schoolId, role, updates) {
    const customization = await MenuCustomization.findOneAndUpdate(
      { schoolId, role },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    
    return customization;
  }

  async addCustomMenuItem(schoolId, role, menuItem, userId) {
    const customization = await this.getMenuCustomization(schoolId, role);
    return await customization.addCustomMenuItem(menuItem, userId);
  }

  async removeCustomMenuItem(schoolId, role, menuItemId) {
    const customization = await this.getMenuCustomization(schoolId, role);
    return await customization.removeCustomMenuItem(menuItemId);
  }

  async updateMenuItemVisibility(schoolId, role, menuItemId, visible) {
    const customization = await this.getMenuCustomization(schoolId, role);
    return await customization.updateMenuItemVisibility(menuItemId, visible);
  }

  async getSidebarData(userId, schoolId, role) {
    const [preferences, menuCustomization] = await Promise.all([
      this.getUserPreferences(userId, schoolId),
      this.getMenuCustomization(schoolId, role)
    ]);

    const filteredMenuItems = this.filterMenuItems(
      menuCustomization.menuItems,
      preferences.hiddenMenuItems
    );

    const mergedMenuItems = this.mergeCustomMenuItems(
      filteredMenuItems,
      menuCustomization.customMenuItems
    );

    return {
      preferences: {
        isCollapsed: preferences.isCollapsed,
        expandedMenus: preferences.expandedMenus,
        theme: preferences.theme,
        sidebarWidth: preferences.sidebarWidth,
        maxRecentItems: preferences.maxRecentItems,
        showQuickActions: preferences.showQuickActions,
        showRecentItems: preferences.showRecentItems,
        showBookmarks: preferences.showBookmarks
      },
      menuItems: mergedMenuItems,
      quickActions: preferences.quickActions.filter(a => a.enabled),
      recentItems: preferences.recentItems.slice(0, preferences.maxRecentItems),
      bookmarks: preferences.bookmarks,
      pinnedItems: preferences.pinnedItems
    };
  }

  filterMenuItems(menuItems, hiddenItems) {
    return menuItems
      .filter(item => !hiddenItems.includes(item.id))
      .map(item => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: this.filterMenuItems(item.children, hiddenItems)
          };
        }
        return item;
      });
  }

  mergeCustomMenuItems(menuItems, customItems) {
    const merged = [...menuItems];
    
    customItems.forEach(customItem => {
      const sectionIndex = merged.findIndex(item => item.label === customItem.section);
      
      if (sectionIndex > -1) {
        merged.splice(sectionIndex + 1, 0, {
          id: customItem.id,
          label: customItem.label,
          icon: customItem.icon,
          to: customItem.to,
          custom: true
        });
      } else {
        merged.push({
          id: customItem.id,
          label: customItem.label,
          icon: customItem.icon,
          to: customItem.to,
          custom: true
        });
      }
    });
    
    return merged;
  }

  getDefaultQuickActions() {
    return [
      {
        id: 'add-student',
        label: 'Add Student',
        icon: 'ti ti-user-plus',
        shortcut: 'Ctrl+N',
        category: 'frequent',
        order: 0,
        enabled: true
      },
      {
        id: 'view-reports',
        label: 'View Reports',
        icon: 'ti ti-chart-bar',
        category: 'frequent',
        order: 1,
        enabled: true
      },
      {
        id: 'schedule-meeting',
        label: 'Schedule Meeting',
        icon: 'ti ti-calendar-plus',
        category: 'recent',
        order: 2,
        enabled: true
      }
    ];
  }

  getDefaultMenuItems(role) {
    return [];
  }

  async resetPreferences(userId, schoolId) {
    await SidebarPreference.findOneAndDelete({ userId, schoolId });
    return await this.getUserPreferences(userId, schoolId);
  }

  async exportPreferences(userId, schoolId) {
    const preferences = await this.getUserPreferences(userId, schoolId);
    return {
      isCollapsed: preferences.isCollapsed,
      pinnedItems: preferences.pinnedItems,
      bookmarks: preferences.bookmarks,
      quickActions: preferences.quickActions,
      hiddenMenuItems: preferences.hiddenMenuItems,
      expandedMenus: preferences.expandedMenus,
      theme: preferences.theme,
      maxRecentItems: preferences.maxRecentItems,
      showQuickActions: preferences.showQuickActions,
      showRecentItems: preferences.showRecentItems,
      showBookmarks: preferences.showBookmarks
    };
  }

  async importPreferences(userId, schoolId, preferencesData) {
    return await this.updatePreferences(userId, schoolId, preferencesData);
  }
}

export default new SidebarService();
