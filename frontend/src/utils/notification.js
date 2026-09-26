export const formatNotification = (item) => ({
  id: item.id || Date.now(),
  title: item.title || item.type || 'Notification',
  message: item.message || 'New activity',
  type: item.type || 'info'
});
