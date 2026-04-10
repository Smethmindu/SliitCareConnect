const mockBookings = [
  {
    bookingId: "BKG001",
    studentId: "STD001",
    counselorId: "CNS001",
    status: "COMPLETED",
    endedAt: "2026-02-26T10:30:00Z",
  },
  {
    bookingId: "BKG002",
    studentId: "STD001",
    counselorId: "CNS002",
    status: "SCHEDULED",
    endedAt: null,
  },
  {
  bookingId: "BKG003",
  studentId: "STD001",
  counselorId: "CNS003",
  status: "COMPLETED",
  endedAt: "2026-02-27T11:00:00Z",
}
];

export const getBookingById = async (bookingId) => {
  return mockBookings.find((b) => b.bookingId === bookingId);
};