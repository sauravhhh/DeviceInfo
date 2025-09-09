document.addEventListener('DOMContentLoaded', function() {
    getDeviceInfo();
    getBrowserInfo();
    getNetworkInfo();
    getLocationInfo();

    document.getElementById('refreshBtn').addEventListener('click', function() {
        getDeviceInfo();
        getBrowserInfo();
        getNetworkInfo();
        getLocationInfo();
        showToast();
    });
});

async function getDeviceInfo() {
    const deviceInfoContainer = document.getElementById('deviceInfo');
    
    const deviceInfo = [
        { label: 'Platform', value: navigator.platform },
        { label: 'Device Type', value: getDeviceType() },
        { label: 'Device Memory (RAM)', value: getDeviceMemory() },
        { label: 'Screen Resolution', value: `${screen.width} × ${screen.height}` },
        { label: 'Viewport Size', value: `${window.innerWidth} × ${window.innerHeight}` },
        { label: 'Color Depth', value: `${screen.colorDepth} bits` },
        { label: 'Pixel Ratio', value: window.devicePixelRatio },
        { label: 'Touch Support', value: 'ontouchstart' in window ? 'Yes' : 'No' },
        { label: 'Hardware Concurrency', value: navigator.hardwareConcurrency || 'N/A' },
        { label: 'Memory Usage', value: getMemoryUsage() }
    ];

    // Add battery status if supported
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            const batteryLevel = Math.round(battery.level * 100);
            const isCharging = battery.charging ? 'Charging' : 'Discharging';
            
            // Add battery info to deviceInfo array
            deviceInfo.push({ 
                label: 'Battery Status', 
                value: createBatteryElement(batteryLevel, isCharging) 
            });
        } catch (error) {
            deviceInfo.push({ label: 'Battery Status', value: 'Not available' });
        }
    } else {
        deviceInfo.push({ label: 'Battery Status', value: 'Not supported' });
    }

    // Add camera resolution options
    deviceInfo.push({ 
        label: 'Camera Resolution Options', 
        value: getCameraResolutionOptions() 
    });

    deviceInfoContainer.innerHTML = '';
    deviceInfo.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
        `;
        deviceInfoContainer.appendChild(infoItem);
    });
}

function getDeviceMemory() {
    if ('deviceMemory' in navigator) {
        return `${navigator.deviceMemory} GB`;
    }
    return 'Not available';
}

function getMemoryUsage() {
    if ('memory' in performance) {
        const memory = performance.memory;
        const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
        const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
        const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
        return `${used} MB / ${total} MB (Limit: ${limit} MB)`;
    }
    return 'Not available';
}

function getCameraResolutionOptions() {
    return `
        <button class="camera-btn" id="cameraBtn">Check Camera Resolutions</button>
        <div class="camera-resolutions" id="cameraResolutions"></div>
    `;
}

function createBatteryElement(level, status) {
    let batteryClass = 'battery-high';
    if (level <= 20) batteryClass = 'battery-low';
    else if (level <= 50) batteryClass = 'battery-medium';
    
    return `
        <div class="battery-container">
            <div class="battery-icon">
                <div class="battery-level ${batteryClass}" style="width: ${level}%"></div>
            </div>
            <span>${level}% (${status})</span>
        </div>
    `;
}

function getBrowserInfo() {
    const browserInfoContainer = document.getElementById('browserInfo');
    
    const browserInfo = [
        { label: 'Browser Name', value: getBrowserName() },
        { label: 'Browser Version', value: getBrowserVersion() },
        { label: 'User Agent', value: navigator.userAgent },
        { label: 'Language', value: navigator.language },
        { label: 'Cookies Enabled', value: navigator.cookieEnabled ? 'Yes' : 'No' },
        { label: 'Do Not Track', value: navigator.doNotTrack ? 'Yes' : 'No' },
        { label: 'Online Status', value: navigator.onLine ? 'Online' : 'Offline' },
        { label: 'Java Enabled', value: navigator.javaEnabled() ? 'Yes' : 'No' }
    ];

    browserInfoContainer.innerHTML = '';
    browserInfo.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
        `;
        browserInfoContainer.appendChild(infoItem);
    });
}

async function getNetworkInfo() {
    const networkInfoContainer = document.getElementById('networkInfo');
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const networkInfo = [
            { label: 'IP Address', value: data.ip || 'N/A' },
            { label: 'ISP', value: data.org || 'N/A' },
            { label: 'ASN', value: data.asn || 'N/A' },
            { label: 'Timezone', value: data.timezone || 'N/A' },
            { label: 'UTC Offset', value: data.utc_offset || 'N/A' }
        ];

        networkInfoContainer.innerHTML = '';
        networkInfo.forEach(item => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.innerHTML = `
                <span class="info-label">${item.label}</span>
                <span class="info-value">${item.value}</span>
            `;
            networkInfoContainer.appendChild(infoItem);
        });
    } catch (error) {
        networkInfoContainer.innerHTML = '<div class="info-item"><span class="info-label">Error</span><span class="info-value">Failed to load network information</span></div>';
    }
}

async function getLocationInfo() {
    const locationInfoContainer = document.getElementById('locationInfo');
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const locationInfo = [
            { label: 'Country', value: data.country_name || 'N/A' },
            { label: 'Region', value: data.region || 'N/A' },
            { label: 'City', value: data.city || 'N/A' },
            { label: 'Postal Code', value: data.postal || 'N/A' },
            { label: 'Latitude', value: data.latitude || 'N/A' },
            { label: 'Longitude', value: data.longitude || 'N/A' }
        ];

        locationInfoContainer.innerHTML = '';
        locationInfo.forEach(item => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.innerHTML = `
                <span class="info-label">${item.label}</span>
                <span class="info-value">${item.value}</span>
            `;
            locationInfoContainer.appendChild(infoItem);
        });
    } catch (error) {
        locationInfoContainer.innerHTML = '<div class="info-item"><span class="info-label">Error</span><span class="info-value">Failed to load location information</span></div>';
    }
}

function getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        return 'Tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
        return 'Mobile';
    }
    return 'Desktop';
}

function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        return "Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
    } else if (userAgent.indexOf("Opera") > -1) {
        return "Opera";
    }
    return "Unknown";
}

function getBrowserVersion() {
    const userAgent = navigator.userAgent;
    let browserName = getBrowserName();
    let version = "Unknown";
    
    switch(browserName) {
        case "Chrome":
            version = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
            break;
        case "Safari":
            version = userAgent.match(/Version\/(\d+\.\d+)/)[1];
            break;
        case "Firefox":
            version = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
            break;
        case "Internet Explorer":
            version = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1];
            break;
        case "Edge":
            version = userAgent.match(/Edge\/(\d+\.\d+)/)[1];
            break;
        case "Opera":
            version = userAgent.match(/Opera\/(\d+\.\d+)/)[1];
            break;
    }
    
    return version;
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Camera resolution detection
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'cameraBtn') {
        e.preventDefault();
        getCameraResolutions();
    }
});

async function getCameraResolutions() {
    const cameraResolutionsDiv = document.getElementById('cameraResolutions');
    cameraResolutionsDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
            cameraResolutionsDiv.innerHTML = 'No camera devices found';
            return;
        }
        
        let resolutionsHtml = '';
        
        for (const device of videoDevices) {
            resolutionsHtml += `<strong>${device.label || 'Unnamed Camera'}</strong><br>`;
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { deviceId: device.deviceId } 
                });
                
                const videoTrack = stream.getVideoTracks()[0];
                const capabilities = videoTrack.getCapabilities();
                
                if (capabilities.width && capabilities.height) {
                    resolutionsHtml += `Max: ${capabilities.width.max} × ${capabilities.height.max}<br>`;
                    resolutionsHtml += `Min: ${capabilities.width.min} × ${capabilities.height.min}<br>`;
                }
                
                if (capabilities.frameRate) {
                    resolutionsHtml += `Frame Rate: ${capabilities.frameRate.max} fps<br>`;
                }
                
                if (capabilities.facingMode) {
                    resolutionsHtml += `Facing: ${capabilities.facingMode}<br>`;
                }
                
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                resolutionsHtml += 'Permission denied or error accessing camera<br>';
            }
            
            resolutionsHtml += '<br>';
        }
        
        cameraResolutionsDiv.innerHTML = resolutionsHtml;
    } catch (error) {
        cameraResolutionsDiv.innerHTML = 'Error accessing camera information';
    }
          }
