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

  export function setOrgs(orgs) {
    return {
      type: 'SET_ORGS',
      orgs
    }
  }

  export function setSidebarItem(sidebar_item) {
    return {
      type: 'SET_SIDEBAR',
      sidebar_item
    }
  }