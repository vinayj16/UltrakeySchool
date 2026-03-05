import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import fileManagerService, { type FileManagerItem, type StorageInfo, type Statistics } from "../../services/fileManagerService";

const FileManagerPage: React.FC = () => {
  const [items, setItems] = useState<FileManagerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'all' | 'folders' | 'files' | 'favorites' | 'trash'>('all');
  const [currentParentId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('folder');

  const [formData, setFormData] = useState({
    name: '',
    type: 'folder' as 'file' | 'folder',
    fileType: 'other' as 'pdf' | 'doc' | 'xls' | 'img' | 'video' | 'audio' | 'other',
    description: '',
    tags: ''
  });

  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    fetchItems();
    fetchStorageInfo();
    fetchStatistics();
  }, [currentView, currentParentId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params: any = { ownerId: userId };

      if (currentView === 'folders') {
        params.type = 'folder';
        params.status = 'active';
      } else if (currentView === 'files') {
        params.type = 'file';
        params.status = 'active';
      } else if (currentView === 'favorites') {
        params.status = 'active';
      } else if (currentView === 'trash') {
        params.status = 'trash';
      } else {
        params.status = 'active';
      }

      if (currentParentId) {
        params.parentId = currentParentId;
      }

      const response = await fileManagerService.getAllItems(params);
      let fetchedItems = response.data || [];

      if (currentView === 'favorites') {
        fetchedItems = fetchedItems.filter((item: FileManagerItem) => item.isFavorite);
      }

      setItems(fetchedItems);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const response = await fileManagerService.getStorageInfo(userId);
      setStorageInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch storage info:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fileManagerService.getStatistics(userId);
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleCreateItem = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      await fileManagerService.createItem({
        name: formData.name,
        type: formData.type,
        fileType: formData.type === 'file' ? formData.fileType : undefined,
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        parentId: currentParentId || undefined,
        ownerId: userId,
        ownerName: currentUser.name || 'User',
        ownerImg: currentUser.avatar,
        status: 'active'
      });

      toast.success(`${formData.type === 'folder' ? 'Folder' : 'File'} created successfully`);
      setShowCreateModal(false);
      setFormData({ name: '', type: 'folder', fileType: 'other', description: '', tags: '' });
      fetchItems();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fileManagerService.toggleFavorite(id);
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ));
      toast.success('Favorite status updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update favorite');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      if (currentView === 'trash') {
        await fileManagerService.deleteItem(id);
        toast.success('Item permanently deleted');
      } else {
        await fileManagerService.moveToTrash(id);
        toast.success('Item moved to trash');
      }
      fetchItems();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await fileManagerService.restoreItem(id);
      toast.success('Item restored successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restore item');
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i._id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`Delete ${selectedItems.length} items?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedItems.map(id => 
        currentView === 'trash' 
          ? fileManagerService.deleteItem(id)
          : fileManagerService.moveToTrash(id)
      ));
      toast.success(`${selectedItems.length} items deleted`);
      setSelectedItems([]);
      setSelectAll(false);
      fetchItems();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }
    try {
      setLoading(true);
      const response = await fileManagerService.searchItems(searchQuery, userId);
      setItems(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (item: FileManagerItem) => {
    if (item.type === 'folder') return 'ti-folder';
    switch (item.fileType) {
      case 'pdf': return 'ti-file-type-pdf';
      case 'doc': return 'ti-file-type-doc';
      case 'xls': return 'ti-file-type-xls';
      case 'img': return 'ti-photo';
      case 'video': return 'ti-video';
      case 'audio': return 'ti-music';
      default: return 'ti-file';
    }
  };

  const folders = items.filter(i => i.type === 'folder');
  const files = items.filter(i => i.type === 'file');

  return (
    <div className="content">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="mb-1">File Manager</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li className="breadcrumb-item">Application</li>
              <li className="breadcrumb-item active" aria-current="page">
                File Manager
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchItems}>
            <i className="ti ti-refresh me-2" />Refresh
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 col-md-12">
          <div className="card">
            <div className="card-body">
              <button 
                className="btn btn-primary w-100 mb-3"
                onClick={() => {
                  setCreateType('folder');
                  setFormData(prev => ({ ...prev, type: 'folder' }));
                  setShowCreateModal(true);
                }}
              >
                <i className="ti ti-folder-plus me-2" />New Folder
              </button>

              <button 
                className="btn btn-outline-primary w-100 mb-3"
                onClick={() => {
                  setCreateType('file');
                  setFormData(prev => ({ ...prev, type: 'file' }));
                  setShowCreateModal(true);
                }}
              >
                <i className="ti ti-file-plus me-2" />New File
              </button>

              <nav className="mb-3">
                <button 
                  className={`btn btn-link text-start w-100 ${currentView === 'all' ? 'active' : ''}`}
                  onClick={() => setCurrentView('all')}
                >
                  <i className="ti ti-files me-2" />All Files
                </button>
                <button 
                  className={`btn btn-link text-start w-100 ${currentView === 'folders' ? 'active' : ''}`}
                  onClick={() => setCurrentView('folders')}
                >
                  <i className="ti ti-folder me-2" />Folders
                </button>
                <button 
                  className={`btn btn-link text-start w-100 ${currentView === 'files' ? 'active' : ''}`}
                  onClick={() => setCurrentView('files')}
                >
                  <i className="ti ti-file me-2" />Files
                </button>
                <button 
                  className={`btn btn-link text-start w-100 ${currentView === 'favorites' ? 'active' : ''}`}
                  onClick={() => setCurrentView('favorites')}
                >
                  <i className="ti ti-star me-2" />Favorites
                </button>
                <button 
                  className={`btn btn-link text-start w-100 ${currentView === 'trash' ? 'active' : ''}`}
                  onClick={() => setCurrentView('trash')}
                >
                  <i className="ti ti-trash me-2" />Trash
                </button>
              </nav>

              {storageInfo && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Storage</h6>
                    <span className="text-muted small">{storageInfo.percentage}%</span>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${storageInfo.percentage > 80 ? 'bg-danger' : 'bg-primary'}`}
                      style={{ width: `${storageInfo.percentage}%` }}
                    />
                  </div>
                  <small className="text-muted">
                    {formatSize(storageInfo.usedSize)} of {formatSize(storageInfo.totalSize)} used
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-12">
          <div className="card mb-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search files and folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>
                      <i className="ti ti-search" />
                    </button>
                  </div>
                </div>
                <div className="col-md-6 text-end mt-2 mt-md-0">
                  {selectedItems.length > 0 && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={handleBulkDelete}
                    >
                      <i className="ti ti-trash me-2" />
                      Delete Selected ({selectedItems.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {statistics && (
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="ti ti-folder text-primary" style={{ fontSize: '32px' }} />
                    <h4 className="mt-2 mb-0">{statistics.totalFolders || 0}</h4>
                    <p className="text-muted mb-0">Folders</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="ti ti-file text-success" style={{ fontSize: '32px' }} />
                    <h4 className="mt-2 mb-0">{statistics.totalFiles || 0}</h4>
                    <p className="text-muted mb-0">Files</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="ti ti-file-type-pdf text-danger" style={{ fontSize: '32px' }} />
                    <h4 className="mt-2 mb-0">{statistics.filesByType?.pdf || 0}</h4>
                    <p className="text-muted mb-0">PDF Files</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="ti ti-photo text-warning" style={{ fontSize: '32px' }} />
                    <h4 className="mt-2 mb-0">{statistics.filesByType?.img || 0}</h4>
                    <p className="text-muted mb-0">Images</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="ti ti-folder-off" style={{ fontSize: '64px', opacity: 0.3 }} />
                <p className="text-muted mt-3">No items found</p>
              </div>
            </div>
          ) : (
            <>
              {folders.length > 0 && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">Folders</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {folders.map(folder => (
                        <div key={folder._id} className="col-md-4 mb-3">
                          <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex align-items-center">
                                <i className="ti ti-folder text-warning me-2" style={{ fontSize: '24px' }} />
                                <h6 className="mb-0">{folder.name}</h6>
                              </div>
                              <div>
                                <button 
                                  className="btn btn-link btn-sm p-0 me-2"
                                  onClick={(e) => handleToggleFavorite(folder._id, e)}
                                >
                                  <i className={`ti ti-star ${folder.isFavorite ? 'text-warning' : ''}`} />
                                </button>
                                <div className="dropdown d-inline">
                                  <button 
                                    className="btn btn-link btn-sm p-0"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </button>
                                  <ul className="dropdown-menu">
                                    {currentView === 'trash' ? (
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => handleRestore(folder._id)}
                                        >
                                          <i className="ti ti-restore me-2" />Restore
                                        </button>
                                      </li>
                                    ) : null}
                                    <li>
                                      <button 
                                        className="dropdown-item text-danger"
                                        onClick={() => handleDelete(folder._id)}
                                      >
                                        <i className="ti ti-trash me-2" />Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="text-muted small">
                              {folder.fileCount} files • {formatSize(folder.size)}
                            </div>
                            {folder.tags.length > 0 && (
                              <div className="mt-2">
                                {folder.tags.map((tag, idx) => (
                                  <span key={idx} className="badge bg-light text-dark me-1">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Files</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Size</th>
                            <th>Modified</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {files.map(file => (
                            <tr key={file._id}>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedItems.includes(file._id)}
                                  onChange={() => handleSelectItem(file._id)}
                                />
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <i className={`${getFileIcon(file)} me-2`} style={{ fontSize: '20px' }} />
                                  {file.name}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {file.ownerImg && (
                                    <img 
                                      src={file.ownerImg} 
                                      alt={file.ownerName}
                                      className="rounded-circle me-2"
                                      style={{ width: '24px', height: '24px' }}
                                    />
                                  )}
                                  {file.ownerName}
                                </div>
                              </td>
                              <td>{formatSize(file.size)}</td>
                              <td>{new Date(file.updatedAt).toLocaleDateString()}</td>
                              <td>
                                <button 
                                  className="btn btn-link btn-sm p-0 me-2"
                                  onClick={(e) => handleToggleFavorite(file._id, e)}
                                >
                                  <i className={`ti ti-star ${file.isFavorite ? 'text-warning' : ''}`} />
                                </button>
                                <div className="dropdown d-inline">
                                  <button 
                                    className="btn btn-link btn-sm p-0"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="ti ti-dots-vertical" />
                                  </button>
                                  <ul className="dropdown-menu">
                                    {currentView === 'trash' ? (
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => handleRestore(file._id)}
                                        >
                                          <i className="ti ti-restore me-2" />Restore
                                        </button>
                                      </li>
                                    ) : null}
                                    <li>
                                      <button 
                                        className="dropdown-item text-danger"
                                        onClick={() => handleDelete(file._id)}
                                      >
                                        <i className="ti ti-trash me-2" />Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Create New {createType === 'folder' ? 'Folder' : 'File'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={`Enter ${createType} name`}
                  />
                </div>
                {createType === 'file' && (
                  <div className="mb-3">
                    <label className="form-label">File Type</label>
                    <select
                      className="form-select"
                      value={formData.fileType}
                      onChange={(e) => setFormData(prev => ({ ...prev, fileType: e.target.value as any }))}
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">Document</option>
                      <option value="xls">Spreadsheet</option>
                      <option value="img">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tags (Optional, comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="work, important, project"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleCreateItem}
                  disabled={loading || !formData.name}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-check me-2" />Create
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagerPage;
