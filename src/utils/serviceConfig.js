// Centralized service configuration
export const SERVICE_MODES = {
    online: {
        value: 'online',
        label: 'Consult Online',
        type: 'online'
    },
    pandit_center: {
        value: 'pandit_center',
        label: 'Consult at Astrologer location',
        type: 'offline'
    },
    pooja_at_home: {
        value: 'pooja_at_home',
        label: 'Pooja at Home',
        type: 'offline'
    }
};

// Helper function to get service mode options
export const getServiceModeOptions = () => Object.values(SERVICE_MODES);

// Helper function to get service type
export const getServiceType = (serviceMode) => SERVICE_MODES[serviceMode]?.type || 'online';

// Helper function to get service mode label
export const getServiceModeLabel = (serviceMode) => SERVICE_MODES[serviceMode]?.label || 'Online';
