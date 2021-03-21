export function successToast(msg, duration) {
  const toast = document.createElement("ion-toast");
  toast.message = msg;
  toast.duration = duration || 1000;
  toast.position = "top";
  toast.color = "success";
  document.body.appendChild(toast);
  return toast.present();
}

export function warningToast(msg, duration) {
  const toast = document.createElement("ion-toast");
  toast.message = msg;
  toast.duration = duration || 2000;
  toast.position = "top";
  toast.color = "warning";
  document.body.appendChild(toast);
  return toast.present();
}
export function dangerToast(msg, duration) {
  const toast = document.createElement("ion-toast");
  toast.message = msg;
  toast.duration = duration || 3000;
  toast.position = "top";
  toast.color = "danger";
  document.body.appendChild(toast);
  return toast.present();
}
