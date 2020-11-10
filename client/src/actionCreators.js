import shortid from 'shortid';

export function addAlert(message, alert_type) {
    return {
      type: 'ADD_ALERT',
      id: shortid.generate(),
      message,
      alert_type
    }
  }
  
  export function removeAlert(id) {
    return {
      type: 'REMOVE_ALERT',
      id
    }
  }