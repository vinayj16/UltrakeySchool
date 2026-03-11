import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { timetableService } from '../../services/timetableService';
import type { Timetable } from '../../services/timetableService';

interface Period {
  periodNumber: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room?: string;
}

const ClassTimeTablePage: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [newPeriod, setNewPeriod] = useState<Period>({
    periodNumber: 1,
    subject: '',
    teacher: '',
    startTime: '',
    endTime: '',
    room: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    { label: '09:00 - 09:45 AM', start: '09:00', end: '09:45' },
    { label: '09:45 - 10:30 AM', start: '09:45', end: '10:30' },
    { label: '10:45 - 11:30 AM', start: '10:45', end: '11:30' },
    { label: '11:30 - 12:15 PM', start: '11:30', end: '12:15' },
    { label: '01:30 - 02:15 PM', start: '13:30', end: '14:15' },
    { label: '02:15 - 03:00 PM', start: '14:15', end: '15:00' },
    { label: '03:15 - 04:00 PM', start: '15:15', end: '16:00' },
  ];

  const breakTimes = [
    { type: 'Morning Break', time: '10:30 to 10:45 AM', color: 'primary' },
    { type: 'Lunch', time: '12:15 to 01:30 PM', color: 'warning' },
    { type: 'Evening Break', time: '03:00 to 03:15 PM', color: 'info' },
  ];

  const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    fetchTimetables();
  }, [selectedClass, selectedSection]);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (selectedClass) params.class = selectedClass;
      if (selectedSection) params.section = selectedSection;
      
      const response = await timetableService.getAll(params);
      setTimetables(response.data || []);
    } catch (error) {
      console.error('Error fetching timetables:', error);
      toast.error('Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !newPeriod.subject || !newPeriod.teacher) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const timetableData = {
        class: selectedClass,
        section: selectedSection,
        day: selectedDay.toLowerCase(),
        periods: [newPeriod],
        academicYear: '2024-2025',
      };

      await timetableService.create(timetableData);
      setShowAddModal(false);
      resetForm();
      toast.success('Period added successfully');
      fetchTimetables();
    } catch (error) {
      console.error('Error adding period:', error);
      toast.error('Failed to add period');
    }
  };

  const resetForm = () => {
    setNewPeriod({
      periodNumber: 1,
      subject: '',
      teacher: '',
      startTime: '',
      endTime: '',
      room: '',
    });
    setSelectedDay('Monday');
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    toast.info(`Export as ${type.toUpperCase()} - Feature coming soon`);
  };

  const getPeriodForSlot = (day: string, startTime: string, endTime: string) => {
    const dayTimetable = timetables.find(
      (tt) => tt.day.toLowerCase() === day.toLowerCase()
    );
    
    if (!dayTimetable) return null;

    return dayTimetable.periods.find(
      (period) => period.startTime === startTime && period.endTime === endTime
    );
  };

  const getColorForPeriod = (index: number) => {
    const colors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary', 'dark'];
    return colors[index % colors.length];
  };

  return (
    <>
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Class Timetable</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">Academic</li>
              <li className="breadcrumb-item active" aria-current="page">
                Timetable
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button
              className="btn btn-outline-light bg-white btn-icon me-1"
              onClick={fetchTimetables}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Refresh"
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>
          <div className="pe-1 mb-2">
            <button
              className="btn btn-outline-light bg-white btn-icon me-1"
              onClick={() => window.print()}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Print"
            >
              <i className="ti ti-printer"></i>
            </button>
          </div>
          <div className="dropdown me-2 mb-2">
            <button
              className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i className="ti ti-file-export me-2"></i>Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => handleExport('pdf')}
                >
                  <i className="ti ti-file-type-pdf me-2"></i>Export as PDF
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => handleExport('excel')}
                >
                  <i className="ti ti-file-type-xls me-2"></i>Export as Excel
                </button>
              </li>
            </ul>
          </div>
          <div className="mb-2">
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={() => setShowAddModal(true)}
            >
              <i className="ti ti-square-rounded-plus me-2"></i>Add Period
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap">
          <h4 className="mb-3">Timetable</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div className="dropdown mb-3 me-2">
              <button
                className="btn btn-outline-light bg-white dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
              >
                <i className="ti ti-filter me-2"></i>Filter
              </button>
              <div className="dropdown-menu drop-width">
                <form>
                  <div className="d-flex align-items-center border-bottom p-3">
                    <h4>Filter</h4>
                  </div>
                  <div className="p-3 pb-0 border-bottom">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Class</label>
                          <select
                            className="form-select"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                          >
                            <option value="">Select</option>
                            {classes.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Section</label>
                          <select
                            className="form-select"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                          >
                            <option value="">Select</option>
                            {sections.map((section) => (
                              <option key={section} value={section}>
                                {section}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 d-flex align-items-center justify-content-end">
                    <button
                      type="button"
                      className="btn btn-light me-3"
                      onClick={() => {
                        setSelectedClass('');
                        setSelectedSection('');
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Time</th>
                    {days.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => (
                    <tr key={index}>
                      <td className="text-nowrap">
                        <i className="ti ti-clock me-1"></i>
                        {slot.label}
                      </td>
                      {days.map((day) => {
                        const period = getPeriodForSlot(day, slot.start, slot.end);
                        const color = getColorForPeriod(index);

                        return (
                          <td key={`${day}-${index}`}>
                            {period ? (
                              <div className={`p-2 bg-${color}-light rounded`}>
                                <div className="fw-medium">
                                  <span className="text-muted small">Subject: </span>
                                  {period.subject}
                                </div>
                                <div className="mt-1">
                                  <span className="text-muted small">
                                    <i className="ti ti-user me-1"></i>
                                    {period.teacher}
                                  </span>
                                </div>
                                {period.room && (
                                  <div className="mt-1">
                                    <span className="text-muted small">
                                      <i className="ti ti-door me-1"></i>
                                      Room {period.room}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-2 text-muted text-center">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer border-0 pb-0">
          <div className="row">
            {breakTimes.map((breakTime, index) => (
              <div key={index} className="col-lg-4 col-xxl-4 col-xl-4 d-flex mb-3">
                <div className="card flex-fill">
                  <div className="card-body p-3">
                    <span className={`bg-${breakTime.color} badge badge-sm mb-2`}>
                      {breakTime.type}
                    </span>
                    <p className="text-dark mb-0">
                      <i className="ti ti-clock me-1"></i>
                      {breakTime.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Period</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleAddPeriod}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <select
                          className="form-select"
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <select
                          className="form-select"
                          value={selectedSection}
                          onChange={(e) => setSelectedSection(e.target.value)}
                        >
                          <option value="">Select Section</option>
                          {sections.map((section) => (
                            <option key={section} value={section}>
                              {section}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Day</label>
                        <select
                          className="form-select"
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          required
                        >
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Period Number</label>
                        <input
                          type="number"
                          className="form-control"
                          value={newPeriod.periodNumber}
                          onChange={(e) =>
                            setNewPeriod({
                              ...newPeriod,
                              periodNumber: parseInt(e.target.value),
                            })
                          }
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newPeriod.subject}
                          onChange={(e) =>
                            setNewPeriod({ ...newPeriod, subject: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Teacher</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newPeriod.teacher}
                          onChange={(e) =>
                            setNewPeriod({ ...newPeriod, teacher: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={newPeriod.startTime}
                          onChange={(e) =>
                            setNewPeriod({ ...newPeriod, startTime: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={newPeriod.endTime}
                          onChange={(e) =>
                            setNewPeriod({ ...newPeriod, endTime: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Room (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newPeriod.room}
                          onChange={(e) =>
                            setNewPeriod({ ...newPeriod, room: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Period
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassTimeTablePage;
