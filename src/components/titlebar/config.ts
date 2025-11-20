import { getCurrentWindow } from "@tauri-apps/api/window";

// when using `"withGlobalTauri": true`, you may use
// const { getCurrentWindow } = window.__TAURI__.window;

const appWindow = getCurrentWindow();

// document
//   .getElementById('titlebar-minimize')
//   ?.addEventListener('click', () => appWindow.minimize());
// document
//   .getElementById('titlebar-maximize')
//   ?.addEventListener('click', () => appWindow.toggleMaximize());
// document
//   .getElementById('titlebar-close')
//   ?.addEventListener('click', () => appWindow.close());

export function minimize() {
    appWindow.minimize();
}

export function maximize() {
    appWindow.toggleMaximize();
}

export function close() {
    appWindow.close();
}

export function startDrag() {
    appWindow.startDragging();
}

// export function startResize() {
//     appWindow.startResizeDragging(direction);
// }

// Utility function to enable dragging on a specific element
export function enableDragging(element: HTMLElement) {
    element.addEventListener("mousedown", (e) => {
        if (e.button === 0) {
            // Left mouse button only
            startDrag();
        }
    });
}

// // Utility function to enable resizing on a specific element
// export function enableResizing(element: HTMLElement) {
//     element.addEventListener('mousedown', (e) => {
//         if (e.button === 0) { // Left mouse button only
//             startResize();
//         }
//     });
// }
