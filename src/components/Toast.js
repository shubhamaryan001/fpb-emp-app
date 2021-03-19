export function successToast(msg) {
  const toast = document.createElement("ion-toast");
  toast.message = msg;
  toast.duration = 2000;
  toast.position = "top";
  toast.color = "success";
  document.body.appendChild(toast);
  return toast.present();
}

export function warningToast(msg) {
  const toast = document.createElement("ion-toast");
  toast.message = msg;
  toast.duration = 3000;
  toast.position = "top";
  toast.color = "warning";
  document.body.appendChild(toast);
  return toast.present();
}
export function dangerToast(msg) {
  const toast = document.createElement("ion-toast");
  toast.message = msg;
  toast.duration = 3000;
  toast.position = "top";
  toast.color = "danger";
  document.body.appendChild(toast);
  return toast.present();
}
