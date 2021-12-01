function updateSubscription(subscription) {
    const key = subscription.getKey("p256dh");
    const token = subscription.getKey("auth");
    const contentEncoding = (PushManager.supportedContentEncodings || ["aesgcm"])[0];
    const data = {
        endpoint: subscription.endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        contentEncoding,
    };
    axios.post("/api/subscriptions", data);
}

function initialiseServiceWorker(subscribe) {
    if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
        console.log("Notifications aren't supported.");
        return;
    }
    if (Notification.permission === "denied") {
        console.log("The user has blocked notifications.");
        return;
    }
    if (!("PushManager" in window)) {
        console.log("Push messaging isn't supported.");
        return;
    }
    navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager
            .getSubscription()
            .then((subscription) => {
                if (!subscription) {
                    return;
                }
                if (subscribe) {
                    updateSubscription(subscription);
                }
            })
            .catch((e) => {
                console.log("Error during getSubscription()", e);
            });
    });
}

export function registerServiceWorker(subscribe = false) {
    if (!("serviceWorker" in navigator)) {
        console.log("Service workers aren't supported in this browser.");
        return new Promise((resolve) => resolve);
    }
    return navigator.serviceWorker.register("/sw.js").then(() => initialiseServiceWorker(subscribe));
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function subscribe() {
    console.log("in");
    navigator.serviceWorker.ready.then((registration) => {
        const options = { userVisibleOnly: true };
        const vapidPublicKey = window.Laravel.vapidPublicKey;
        if (vapidPublicKey) {
            options.applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        }
        registration.pushManager
            .subscribe(options)
            .then((subscription) => {
                updateSubscription(subscription);
            })
            .catch((e) => {
                if (Notification.permission === "denied") {
                    console.log("Permission for Notifications was denied");
                } else {
                    console.log("Unable to subscribe to push.", e);
                }
            });
    });
}