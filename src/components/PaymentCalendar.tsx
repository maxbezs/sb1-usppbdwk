import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell as BellIcon } from 'lucide-react';

interface Payment {
  date: Date;
  amount: number;
  status: 'pending' | 'completed';
  hasReminder: boolean;
}

export function PaymentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [payments] = useState<Payment[]>([
    { date: new Date(2024, 2, 15), amount: 240, status: 'completed', hasReminder: false },
    { date: new Date(2024, 3, 15), amount: 320, status: 'pending', hasReminder: true },
    { date: new Date(2024, 3, 28), amount: 180, status: 'pending', hasReminder: false },
  ]);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  const getPaymentForDate = (date: Date) => {
    return payments.find(payment => 
      payment.date.getDate() === date.getDate() &&
      payment.date.getMonth() === date.getMonth() &&
      payment.date.getFullYear() === date.getFullYear()
    );
  };

  const toggleReminder = (date: Date) => {
    setShowReminderModal(true);
    setSelectedDate(date);
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const payment = getPaymentForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => payment && setSelectedDate(date)}
          className={`relative h-7 p-1 rounded transition-all duration-200 ${
            payment ? 'glass-card hover:scale-105' : 'hover:bg-white/5'
          } ${isToday ? 'ring-1 ring-white/20' : ''}`}
        >
          <span className="absolute top-1 left-1 text-xs">{day}</span>
          {payment && (
            <>
              <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${
                payment.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
              {payment.hasReminder && (
                <BellIcon className="absolute top-1 right-1 w-2 h-2 text-white/70" />
              )}
            </>
          )}
        </button>
      );
    }

    return days;
  };

  const weekDays = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
  ];

  return (
    <div className="flex gap-4">
      <div className="w-[300px] border border-white/20 p-3 rounded-lg">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">{formatDate(currentDate)}</h3>
          <div className="flex gap-1">
            <button
              onClick={previousMonth}
              className="p-1 hover:bg-white/10 rounded-full transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-white/10 rounded-full transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1">
          {weekDays.map(({ key, label }) => (
            <div key={key} className="text-white/70">{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && getPaymentForDate(selectedDate) && (
        <div className="w-[200px] p-3 glass-card-dark rounded text-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-medium">
                £{getPaymentForDate(selectedDate)?.amount}
              </p>
              <p className="text-white/70 text-xs">
                {selectedDate.toLocaleDateString()}
              </p>
              <div className="mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  getPaymentForDate(selectedDate)?.status === 'completed'
                    ? 'bg-green-400/20 text-green-400'
                    : 'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {getPaymentForDate(selectedDate)?.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => toggleReminder(selectedDate)}
              className="p-1.5 hover:bg-white/10 rounded-full transition"
              aria-label="Set reminder"
            >
              <BellIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card-dark p-4 rounded-lg max-w-xs w-full mx-4">
            <h4 className="text-sm font-semibold mb-2">Set Payment Reminder</h4>
            <p className="text-xs text-white/70 mb-4">
              You'll receive a notification before the payment is due.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-3 py-1 text-xs hover:bg-white/10 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle reminder setting logic here
                  setShowReminderModal(false);
                }}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition"
              >
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}