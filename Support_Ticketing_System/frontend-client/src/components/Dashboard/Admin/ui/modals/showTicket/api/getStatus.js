export default function getStatus(status) {
  switch (status) {
    case 1:
      return 'Ticket Opened';
    case 2:
      return 'Ticket Behalf';
    case 3:
      return 'Allocated to Support';
    case 4:
      return 'Allocated to Support(Self)';
    case 5:
      return 'Ticket Checked';
    case 6:
      return 'Ticket reallocated';
    case 7:
      return 'Ticket Solved';
    case 8:
      return 'Ticket Reopened';
    case 9:
      return 'Ticket Suspended';
    case 10:
      return 'More info needed';
    case 11:
      return 'Ticket Closed';
    case 12:
      return 'Ticket Expired(CLS)';
    case 13:
      return 'Ticket cancelled by Support';
    case 14:
      return 'Ticket cancelled by User';
    case 15:
      return 'Ticket abandoned(CANCEL)';
    default: return 'UNKNOWN';
  }
}
