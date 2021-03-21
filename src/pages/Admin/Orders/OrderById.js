/* eslint-disable no-useless-computed-key */
/* eslint-disable react/jsx-no-target-blank */
// eslint-disable-next-line react-hooks/exhaustive-deps

import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import React from "react";
import Header from "../../../components/Header";
import { useState, useEffect, useGlobal } from "reactn";
import { dangerToast, successToast } from "../../../components/Toast";
import axios from "axios";
import {
  checkmarkDoneCircle,
  checkmarkDoneCircleOutline,
  checkmarkOutline,
  closeOutline,
  eyeOutline,
  folderOpenOutline,
  folderOutline,
} from "ionicons/icons";
import { GiSandsOfTime } from "react-icons/gi";
import moment from "moment";
import { API } from "../../../Config";

import {
  orderById,
  logoutHandler,
  createDriveFolder,
  updateFilesLimits,
  updatePaymentStatus,
  getStatusValues,
  updateOrderStatus,
  updateManualStatus,
} from "../ApisAdmin";

function OrderById(props) {
  const [userInfo, setUserInfo] = useGlobal("userInfo");
  const [order, setOrder] = useState();
  const [statusValues, setStatusValues] = useState();
  const [selectedStatusValue, setSelectedStatusValue] = useState();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const [formData, setFormData] = useState(new FormData());
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [updateValues, setUpdateValues] = useState({
    floorPlanLimits: 0,
    frontElevationLimits: 0,
    interiorLimits: 0,
  });
  const {
    floorPlanLimits,
    frontElevationLimits,
    interiorLimits,
  } = updateValues;

  const initStatusValues = () => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    getStatusValues(userId, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          dangerToast(data.error);
          setLoading(false);
        } else {
          setStatusValues(data);

          successToast("values loaded success.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  const initOrder = (orderId) => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    orderById(userId, token, orderId)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          dangerToast(data.error);
          setLoading(false);
        } else {
          setOrder(data.orders);
          setUpdateValues({
            ...updateValues,
            ["floorPlanLimits"]: data.orders.floorPlanUpdateLimit,
            ["frontElevationLimits"]: data.orders.frontElevationUpdateLimit,
            ["interiorLimits"]: data.orders.interiorDesignsUpdateLimit,
          });
          setSelectedStatusValue(data.orders.status);
          successToast("order loaded success");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  const folderCreate = (orderId) => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    createDriveFolder(userId, token, orderId).then((data) => {
      if (data.error) {
        console.log(data.error);
        dangerToast(data.error);
        setLoading(false);
      } else {
        successToast(data.message);
        setLoading(false);
        initOrder(orderId);
      }
    });
  };

  const openFileUploader = (name) => (event) => {
    const selector = document.getElementById(name);
    selector.click();
  };

  const handleFileUpload = (name, o) => async (event) => {
    const userId = userInfo.user._id;
    const token = userInfo.token;
    const file = event.target.files[0];
    const orderId = o._id;
    const options = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        let percent = Math.floor((loaded * 100) / total);

        if (percent < 100) {
          setUploadPercentage(percent);
        }
      },
    };
    setLoading(true);
    if (name === "Floor Plan Folder") {
      const folderId = o.privateFolderIds.floorPlanFolderId;
      formData.set("orderId", orderId);
      formData.set("folderName", name);
      formData.set("fileData", file);
      formData.set("folderId", folderId);

      await axios
        .put(`${API}/upload-files/${userId}`, formData, options)
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
            dangerToast(res.data.error);
            setLoading(false);
          } else {
            setUploadPercentage(100);
            setLoading(false);
            successToast(res.data.message);
            setLoading(false);
            setTimeout(() => {
              setUploadPercentage(0);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploadPercentage(0);
        });
    } else if (name === "Project File Folder") {
      const folderId = o.privateFolderIds.projectFileFolderId;
      formData.set("orderId", orderId);
      formData.set("folderName", name);
      formData.set("fileData", file);
      formData.set("folderId", folderId);

      await axios
        .put(`${API}/upload-files/${userId}`, formData, options)
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
            dangerToast(res.data.error);
            setLoading(false);
          } else {
            console.log(res.data);
            setUploadPercentage(100);
            setLoading(false);
            successToast(res.data.message);
            setLoading(false);
            setTimeout(() => {
              setUploadPercentage(0);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploadPercentage(0);
        });
    } else if (name === "3D Work Folder") {
      const folderId = o.privateFolderIds.threeDElevationFolderId;
      formData.set("orderId", orderId);
      formData.set("folderName", name);
      formData.set("fileData", file);
      formData.set("folderId", folderId);
      await axios
        .put(`${API}/upload-files/${userId}`, formData, options)
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
            dangerToast(res.data.error);
            setLoading(false);
          } else {
            console.log(res.data);
            setUploadPercentage(100);
            setLoading(false);
            successToast(res.data.message);
            setLoading(false);
            setTimeout(() => {
              setUploadPercentage(0);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploadPercentage(0);
        });
    } else if (name === "Final File Folder") {
      const folderId = o.privateFolderIds.completedProjectFileFolderId;
      formData.set("orderId", orderId);
      formData.set("folderName", name);
      formData.set("fileData", file);
      formData.set("folderId", folderId);
      await axios
        .put(`${API}/upload-files/${userId}`, formData, options)
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
            dangerToast(res.data.error);
            setLoading(false);
          } else {
            console.log(res.data);
            setUploadPercentage(100);
            setLoading(false);
            successToast(res.data.message);
            setLoading(false);
            setTimeout(() => {
              setUploadPercentage(0);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploadPercentage(0);
        });
    }
  };

  const handleChangeLimits = (name) => (event) => {
    const value = event.target.value;
    setUpdateValues({ ...updateValues, [name]: value });
  };

  const onSubmitLimits = (name) => (event) => {
    event.preventDefault();
    const userId = userInfo.user._id;
    const token = userInfo.token;
    const orderId = props.match.params.orderId;
    setLoading(true);
    const updateData = {
      updateValues,
      name,
      orderId,
    };
    updateFilesLimits(userId, token, updateData)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          dangerToast(data.error);
          setLoading(false);
        } else {
          setLoading(false);
          initOrder(orderId);
          successToast(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  const togglePaymentStatus = (value, paymentId) => (event) => {
    const orderId = props.match.params.orderId;
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    updatePaymentStatus(userId, token, { value, paymentId, orderId })
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          dangerToast(data.error);
          setLoading(false);
        } else {
          setLoading(false);
          initOrder(orderId);
          successToast(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  const projectStatusUpdate = (orderId, mNo, e) => {
    const value = e.detail.value;
    setSelectedStatusValue(value);
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    updateOrderStatus(userId, token, orderId, value, mNo)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          dangerToast(data.error);
          setLoading(false);
        } else {
          initOrder(orderId);
          successToast(data.message, 5000);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  const manualStatusHandle = (name, orderId) => (event) => {
    const value = event.detail.value;
    const userId = userInfo.user._id;
    const token = userInfo.token;
    setLoading(true);
    updateManualStatus(userId, token, orderId, name, value)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          dangerToast(data.error);
          setLoading(false);
        } else {
          setLoading(false);
          successToast(data.message, 5000);
          initOrder(orderId);
        }
      })
      .catch((err) => {
        console.log(err);
        dangerToast("Please try Again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    async function getOrderId() {
      const orderId = await props.match.params.orderId;
      return orderId;
    }

    getOrderId().then((data) => {
      initOrder(data);
      initStatusValues();
    });
  }, []);

  const firstBlock = (order) => {
    return (
      <>
        <div className="customer-details">
          <IonCard className="single-order-card">
            <IonCardHeader color="secondary">
              <IonCardTitle>CUSTOMER DETAILS</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="default-flex-box">
                <p>Name:</p>
                <p>{order.orderedBy.fullName}</p>
              </div>
              <div className="default-flex-box">
                <p>Email:</p>
                <p>{order.orderedBy.email}</p>
              </div>
              <div className="default-flex-box">
                <p>Mobile Number:</p>
                <p>{order.orderedBy.mobileNumber}</p>
              </div>

              <div className="default-flex-box">
                <p>Secondary No:</p>
                <p>
                  {order.orderedBy.secondaryNumber
                    ? order.orderedBy.secondaryNumber
                    : "No Number"}
                </p>
              </div>
              <div className="default-flex-box">
                <p>Customer Id:</p>
                <p>{order.orderedBy._id}</p>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="single-order-card">
            <IonCardHeader color="secondary">
              <IonCardTitle>ORDER DETAILS</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="big-flex-box">
                <div className="package-box-left">
                  <img src={order.purchasedPackage.packageImage.url} alt="" />
                </div>
                <div className="package-box-right">
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        margin: "0",
                        color: "#4b4b4b",
                      }}
                    >
                      {order.purchasedPackage.packageName}
                    </p>{" "}
                  </div>
                  <div className="default-flex">
                    <div className="left-text"></div>
                    <IonBadge className="custom-badge" color="warning">
                      {order.variantSelected.plotSize} SQ.FT
                    </IonBadge>
                  </div>
                </div>
              </div>

              <div className="default-flex-box">
                <p>Order Id:</p>
                <p>{order._id}</p>
              </div>

              <div className="default-flex-box">
                <p>Floor Counts:</p>
                <p>{order.variantSelected.floorCount}</p>
              </div>
              <div className="default-flex-box">
                <p>Project Code:</p>
                <p>{order.projectCode}</p>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <IonTextarea
                  style={{ background: "#efefef", borderRadius: "5px" }}
                  value={order.note ? order.note : "NO NOTE"}
                  readonly
                />
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  fontStyle: "italic",
                }}
                className="ion-text-center"
              >
                <q>{order.variantSelected.designType}</q>
              </div>

              <div className="default-flex-box small-border-box">
                <p>Architect Assignement:</p>
                <p>{order.assignement.projectArchitect}</p>
              </div>
              <div className="default-flex-box small-border-box">
                <p>Engineer Assignement:</p>
                <p>{order.assignement.projectEngineer}</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </>
    );
  };

  const folderCreation = (order) => {
    if (
      order.purchasedPackage.paymentType === "only-4" ||
      order.purchasedPackage.paymentType === "only-3"
    ) {
      return (
        <>
          <div className="folder-create-modal-open">
            <div className="folder-flex-box">
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", margin: "0" }}>
                  FOLDERS
                  <span>
                    <IonIcon
                      style={{ marginLeft: "5px", fontSize: "20px" }}
                      icon={folderOpenOutline}
                    />
                  </span>
                </p>
              </div>
              {order.privateFolderIds.floorPlanFolderId !== "null" ? (
                <IonButton
                  onClick={() => setShowModal(true)}
                  color="success"
                  size="small"
                >
                  See Folders
                </IonButton>
              ) : (
                <IonButton
                  onClick={() => folderCreate(order._id)}
                  color="warning"
                  size="small"
                >
                  Generate Folders
                </IonButton>
              )}
            </div>

            <IonModal
              isOpen={showModal}
              cssClass="folder-modal"
              swipeToClose={true}
              onDidDismiss={() => setShowModal(false)}
            >
              <div className="modal-body">
                <div className="modal-header">
                  <p className="modal-header-text">FOLDERS</p>
                  <IonIcon
                    onClick={() => setShowModal(false)}
                    className="modal-header-icon"
                    icon={closeOutline}
                  />
                </div>

                <div className="modal-content">
                  <div className="modal-content-inner">
                    <IonGrid>
                      <IonRow>
                        <IonCol size={12}>
                          <div className="default-flex-box-medium">
                            <IonIcon icon={folderOutline} />
                            <p>FLOOR PLAN</p>
                            <IonBadge
                              onClick={openFileUploader("open-uploader-1")}
                              color="success"
                              size="small"
                            >
                              UPLOAD
                            </IonBadge>
                            <a
                              href={order.filesList.floorPlanFiles}
                              target="_blank"
                            >
                              <IonIcon icon={eyeOutline} />
                            </a>
                          </div>
                        </IonCol>
                        <IonCol size={12}>
                          <div className="default-flex-box-medium">
                            <IonIcon icon={folderOutline} />
                            <p>PROJECT FILE</p>
                            <IonBadge
                              onClick={openFileUploader("open-uploader-2")}
                              color="success"
                              size="small"
                            >
                              UPLOAD
                            </IonBadge>
                            <a
                              href={order.filesList.projectFile}
                              target="_blank"
                            >
                              <IonIcon icon={eyeOutline} />
                            </a>
                          </div>
                        </IonCol>
                        <IonCol size={12}>
                          <div className="default-flex-box-medium">
                            <IonIcon icon={folderOutline} />
                            <p>3D WORK</p>
                            <IonBadge
                              onClick={openFileUploader("open-uploader-3")}
                              color="success"
                              size="small"
                            >
                              UPLOAD
                            </IonBadge>
                            <a
                              href={order.filesList.threeDElevation}
                              target="_blank"
                            >
                              <IonIcon icon={eyeOutline} />
                            </a>{" "}
                          </div>
                        </IonCol>{" "}
                        <IonCol size={12}>
                          <div className="default-flex-box-medium">
                            <IonIcon icon={folderOutline} />
                            <p>FINAL FILES</p>
                            <IonBadge
                              onClick={openFileUploader("open-uploader-4")}
                              color="success"
                              size="small"
                            >
                              UPLOAD
                            </IonBadge>
                            <a
                              href={order.filesList.completedProjectFile}
                              target="_blank"
                            >
                              <IonIcon icon={eyeOutline} />
                            </a>{" "}
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    <div className="all-file-upload-inputs">
                      <input
                        className="hidden-input"
                        id="open-uploader-1"
                        type="file"
                        onChange={handleFileUpload("Floor Plan Folder", order)}
                      />
                      <input
                        className="hidden-input"
                        id="open-uploader-2"
                        type="file"
                        onChange={handleFileUpload(
                          "Project File Folder",
                          order
                        )}
                      />
                      <input
                        className="hidden-input"
                        id="open-uploader-3"
                        type="file"
                        onChange={handleFileUpload("3D Work Folder", order)}
                      />
                      <input
                        className="hidden-input"
                        id="open-uploader-4"
                        type="file"
                        onChange={handleFileUpload("Final File Folder", order)}
                      />
                    </div>

                    <div className="file-updates-box">
                      <div className="default-flex-box">
                        <p> Floor Plan Updates:</p>
                        <IonInput
                          type="number"
                          onIonChange={handleChangeLimits("floorPlanLimits")}
                          value={floorPlanLimits}
                          placeholder="updates value"
                        />
                        <IonButton
                          onClick={onSubmitLimits("FPUL")}
                          size="small"
                          color="success"
                        >
                          <IonIcon icon={checkmarkOutline} />
                        </IonButton>
                      </div>
                      <div className="default-flex-box">
                        <p>Front Elevation Updates:</p>
                        <IonInput
                          type="number"
                          onIonChange={handleChangeLimits(
                            "frontElevationLimits"
                          )}
                          value={frontElevationLimits}
                          placeholder="updates value"
                        />{" "}
                        <IonButton
                          onClick={onSubmitLimits("FEUL")}
                          size="small"
                          color="success"
                        >
                          <IonIcon icon={checkmarkOutline} />
                        </IonButton>
                      </div>
                      <div className="default-flex-box">
                        <p>Front Elevation Updates:</p>
                        <IonInput
                          type="number"
                          onIonChange={handleChangeLimits("interiorLimits")}
                          value={interiorLimits}
                          placeholder="updates value"
                        />{" "}
                        <IonButton
                          onClick={onSubmitLimits("IDUL")}
                          size="small"
                          color="success"
                        >
                          <IonIcon icon={checkmarkOutline} />
                        </IonButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </IonModal>
          </div>
        </>
      );
    } else if (order.purchasedPackage.paymentType === "only-1") {
      return (
        <>
          <div className="folder-create-modal-open">
            <div className="folder-flex-box">
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", margin: "0" }}>
                  FOLDERS
                  <span>
                    <IonIcon
                      style={{ marginLeft: "5px", fontSize: "20px" }}
                      icon={folderOpenOutline}
                    />
                  </span>
                </p>
              </div>
              {order.privateFolderIds.floorPlanFolderId !== "null" ? (
                <IonButton
                  onClick={() => setShowModal(true)}
                  color="success"
                  size="small"
                >
                  See Folders
                </IonButton>
              ) : (
                <IonButton
                  onClick={() => folderCreate(order._id)}
                  color="warning"
                  size="small"
                >
                  Generate Folders
                </IonButton>
              )}
            </div>

            <IonModal
              isOpen={showModal}
              cssClass="folder-modal"
              swipeToClose={true}
              onDidDismiss={() => setShowModal(false)}
            >
              <div className="modal-body">
                <div className="modal-header">
                  <p className="modal-header-text">FOLDERS</p>
                  <IonIcon
                    onClick={() => setShowModal(false)}
                    className="modal-header-icon"
                    icon={closeOutline}
                  />
                </div>

                <div className="modal-content">
                  <div className="modal-content-inner">
                    <IonGrid>
                      <IonRow>
                        <IonCol size={12}>
                          <div className="default-flex-box-medium">
                            <IonIcon icon={folderOutline} />
                            <p>FLOOR PLAN</p>
                            <IonBadge
                              onClick={openFileUploader("open-uploader-1")}
                              color="success"
                              size="small"
                            >
                              UPLOAD
                            </IonBadge>
                            <a
                              href={order.filesList.floorPlanFiles}
                              target="_blank"
                            >
                              <IonIcon icon={eyeOutline} />
                            </a>
                          </div>
                        </IonCol>

                        <IonCol size={12}>
                          <div className="default-flex-box-medium">
                            <IonIcon icon={folderOutline} />
                            <p>FINAL FILES</p>
                            <IonBadge
                              onClick={openFileUploader("open-uploader-4")}
                              color="success"
                              size="small"
                            >
                              UPLOAD
                            </IonBadge>
                            <a
                              href={order.filesList.completedProjectFile}
                              target="_blank"
                            >
                              <IonIcon icon={eyeOutline} />
                            </a>{" "}
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    <div className="all-file-upload-inputs">
                      <input
                        className="hidden-input"
                        id="open-uploader-1"
                        type="file"
                        onChange={handleFileUpload("Floor Plan Folder", order)}
                      />
                      <input
                        className="hidden-input"
                        id="open-uploader-4"
                        type="file"
                        onChange={handleFileUpload("Final File Folder", order)}
                      />
                    </div>

                    <div className="file-updates-box">
                      <div className="default-flex-box">
                        <p> Floor Plan Updates:</p>
                        <IonInput
                          type="number"
                          onIonChange={handleChangeLimits("floorPlanLimits")}
                          value={floorPlanLimits}
                          placeholder="updates value"
                        />{" "}
                        <IonButton
                          onClick={onSubmitLimits("FPUL")}
                          size="small"
                          color="success"
                        >
                          <IonIcon icon={checkmarkOutline} />
                        </IonButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </IonModal>
          </div>
        </>
      );
    }
  };

  const paymentStatus = (order) => {
    if (order.purchasedPackage.paymentType === "only-4") {
      return (
        <>
          <IonCard className="single-order-card paymentCard">
            <IonCardHeader color="tertiary">
              <IonCardTitle>PAYMENT STATUS</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="default-flex-box-medium bg-change-1">
                <p>
                  FIRST PAYMENT <sup>(₹{order.firstPayment.amount})</sup>
                </p>
                {order.firstPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-1")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-1")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium bg-change-1">
                <p>
                  SECOND PAYMENT <sup>(₹{order.secondPayment.amount})</sup>
                </p>
                {order.secondPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-2")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-2")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium bg-change-1">
                <p>
                  THIRD PAYMENT <sup>(₹{order.thirdPayment.amount})</sup>
                </p>
                {order.thirdPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-3")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-3")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium bg-change-1">
                <p>
                  THIRD PAYMENT <sup>(₹{order.fourthPayment.amount})</sup>
                </p>
                {order.fourthPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-4")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-4")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium-cus ">
                <div className="default-flex-box">
                  <p>First Payment Id:</p>
                  <p>{order.firstPayment.transaction_id}</p>
                </div>
                <div className="default-flex-box">
                  <p>Second Payment Id:</p>
                  <p>{order.secondPayment.transaction_id}</p>
                </div>
                <div className="default-flex-box">
                  <p>Third Payment Id:</p>
                  <p>{order.thirdPayment.transaction_id}</p>
                </div>{" "}
                <div className="default-flex-box">
                  <p>Fourth Payment Id:</p>
                  <p>{order.fourthPayment.transaction_id}</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </>
      );
    } else if (order.purchasedPackage.paymentType === "only-3") {
      return (
        <>
          <IonCard className="single-order-card paymentCard">
            <IonCardHeader color="tertiary">
              <IonCardTitle>PAYMENT STATUS</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="default-flex-box-medium bg-change-1">
                <p>
                  FIRST PAYMENT <sup>(₹{order.firstPayment.amount})</sup>
                </p>
                {order.firstPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-1")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-1")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium bg-change-1">
                <p>
                  SECOND PAYMENT <sup>(₹{order.secondPayment.amount})</sup>
                </p>
                {order.secondPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-2")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-2")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium bg-change-1">
                <p>
                  THIRD PAYMENT <sup>(₹{order.thirdPayment.amount})</sup>
                </p>
                {order.thirdPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-3")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-3")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium-cus ">
                <div className="default-flex-box">
                  <p>First Payment Id:</p>
                  <p>{order.firstPayment.transaction_id}</p>
                </div>
                <div className="default-flex-box">
                  <p>Second Payment Id:</p>
                  <p>{order.secondPayment.transaction_id}</p>
                </div>
                <div className="default-flex-box">
                  <p>Third Payment Id:</p>
                  <p>{order.thirdPayment.transaction_id}</p>
                </div>{" "}
              </div>
            </IonCardContent>
          </IonCard>
        </>
      );
    } else if (order.purchasedPackage.paymentType === "only-1") {
      return (
        <>
          <IonCard className="single-order-card paymentCard">
            <IonCardHeader color="tertiary">
              <IonCardTitle>PAYMENT STATUS</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="default-flex-box-medium bg-change-1">
                <p>
                  FIRST PAYMENT <sup>(₹{order.firstPayment.amount})</sup>
                </p>
                {order.firstPayment.paymentStatus ? (
                  <>
                    <IonBadge color="success">PAID</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(false, "P-1")}
                      color="danger"
                    >
                      MARK AS UNPAID
                    </IonBadge>
                  </>
                ) : (
                  <>
                    <IonBadge color="warning">PENDING</IonBadge>
                    <IonBadge
                      onClick={togglePaymentStatus(true, "P-1")}
                      color="secondary"
                    >
                      MARK AS PAID
                    </IonBadge>
                  </>
                )}
              </div>

              <div className="default-flex-box-medium-cus ">
                <div className="default-flex-box">
                  <p>First Payment Id:</p>
                  <p>{order.firstPayment.transaction_id}</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </>
      );
    }
  };

  const projectStatus = (order) => {
    if (order.purchasedPackage.paymentType === "only-4") {
      return (
        <div className="project-status-box">
          <IonCard>
            <div className="default-flex-box">
              <p>PROJECT STATUS</p>
              <IonBadge color="success">{order.status}</IonBadge>
              <IonButton
                onClick={() => setShowModal2(true)}
                size="small"
                color="secondary"
              >
                UPDATE NOW
              </IonButton>
            </div>
          </IonCard>

          <IonModal
            isOpen={showModal2}
            cssClass="status-modal"
            swipeToClose={true}
            onDidDismiss={() => setShowModal2(false)}
          >
            <div className="modal-body">
              <div className="modal-header">
                <p className="modal-header-text">PROJECT STATUS</p>
                <IonIcon
                  onClick={() => setShowModal2(false)}
                  className="modal-header-icon"
                  icon={closeOutline}
                />
              </div>

              <div className="modal-content">
                <div className="modal-content-inner">
                  <div className="first-section-status">
                    <IonItem
                      lines="none"
                      color="secondary"
                      style={{ borderRadius: "5px" }}
                    >
                      <IonLabel style={{ fontSize: "14px", fontWeight: "600" }}>
                        NOTIFICATION STATUS
                      </IonLabel>
                      <IonSelect
                        value={selectedStatusValue}
                        placeholder="select one"
                        onIonChange={(e) =>
                          projectStatusUpdate(
                            order._id,
                            order.orderedBy.mobileNumber,
                            e
                          )
                        }
                      >
                        {statusValues.map((s, i) => (
                          <IonSelectOption key={i} value={s}>
                            {s}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </div>

                  <div className="second-section-status">
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Order Confirmed</p>
                      </div>
                      {order.orderStatus.orderConfirmed ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "orderConfirmed",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">Engineer Assigned</p>
                      </div>
                      {order.orderStatus.engineerAssigned ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "engineerAssigned",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Floor Plan Ready</p>
                      </div>
                      {order.orderStatus.floorPlanReady ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "floorPlanReady",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Floor Plan Finalized</p>
                      </div>
                      {order.orderStatus.floorPlanFinalized ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "floorPlanFinalized",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">
                          Project File Work Started<sup>(After P-2)</sup>
                        </p>
                      </div>
                      {order.orderStatus.projectFileWorkStarted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectFileWorkStarted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex ">
                      <div>
                        <p className="right-label">Project File Completed</p>
                      </div>
                      {order.orderStatus.projectFileCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectFileCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto ">
                      <div>
                        <p className="right-label">3D Work Started</p>
                      </div>
                      {order.orderStatus.threeDworkStarted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "threeDworkStarted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">3D Work Completed</p>
                      </div>
                      {order.orderStatus.threeDworkCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "threeDworkCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">
                          Interior Work Started<sup>(After P-3)</sup>
                        </p>
                      </div>
                      {order.orderStatus.interiorWorkStarted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "interiorWorkStarted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Interior Work Completed</p>
                      </div>
                      {order.orderStatus.interiorWorkCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "interiorWorkCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">
                          Walk Thru Started <sup>(After P-4)</sup>
                        </p>
                      </div>
                      {order.orderStatus.walkThruStarted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "walkThruStarted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>{" "}
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Walk Thru Completed</p>
                      </div>
                      {order.orderStatus.walkThruCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "walkThruCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Project Completed</p>
                      </div>
                      {order.orderStatus.projectCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>{" "}
                    <div className="divider"></div>
                    <div className="order-manual-flex bg-change-danger">
                      <div>
                        <p className="right-label">Payment Pending</p>
                      </div>
                      {order.orderStatus.paymentPending ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "paymentPending",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-danger">
                      <div>
                        <p className="right-label">cancelled</p>
                      </div>
                      {order.orderStatus.cancelled ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "cancelled",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </IonModal>
        </div>
      );
    } else if (order.purchasedPackage.paymentType === "only-3") {
      return (
        <div className="project-status-box">
          <IonCard>
            <div className="default-flex-box">
              <p>PROJECT STATUS</p>
              <IonBadge color="success">{order.status}</IonBadge>
              <IonButton
                onClick={() => setShowModal2(true)}
                size="small"
                color="secondary"
              >
                UPDATE NOW
              </IonButton>
            </div>
          </IonCard>

          <IonModal
            isOpen={showModal2}
            cssClass="status-modal"
            swipeToClose={true}
            onDidDismiss={() => setShowModal2(false)}
          >
            <div className="modal-body">
              <div className="modal-header">
                <p className="modal-header-text">PROJECT STATUS</p>
                <IonIcon
                  onClick={() => setShowModal2(false)}
                  className="modal-header-icon"
                  icon={closeOutline}
                />
              </div>

              <div className="modal-content">
                <div className="modal-content-inner">
                  <div className="first-section-status">
                    <IonItem
                      lines="none"
                      color="secondary"
                      style={{ borderRadius: "5px" }}
                    >
                      <IonLabel style={{ fontSize: "14px", fontWeight: "600" }}>
                        NOTIFICATION STATUS
                      </IonLabel>
                      <IonSelect
                        value={selectedStatusValue}
                        placeholder="select one"
                        onIonChange={(e) =>
                          projectStatusUpdate(
                            order._id,
                            order.orderedBy.mobileNumber,
                            e
                          )
                        }
                      >
                        {statusValues.map((s, i) => (
                          <IonSelectOption key={i} value={s}>
                            {s}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </div>

                  <div className="second-section-status">
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Order Confirmed</p>
                      </div>
                      {order.orderStatus.orderConfirmed ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "orderConfirmed",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">Engineer Assigned</p>
                      </div>
                      {order.orderStatus.engineerAssigned ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "engineerAssigned",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Floor Plan Ready</p>
                      </div>
                      {order.orderStatus.floorPlanReady ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "floorPlanReady",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Floor Plan Finalized</p>
                      </div>
                      {order.orderStatus.floorPlanFinalized ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "floorPlanFinalized",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">
                          Project File Work Started<sup>(After P-2)</sup>
                        </p>
                      </div>
                      {order.orderStatus.projectFileWorkStarted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectFileWorkStarted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex ">
                      <div>
                        <p className="right-label">Project File Completed</p>
                      </div>
                      {order.orderStatus.projectFileCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectFileCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto ">
                      <div>
                        <p className="right-label">3D Work Started</p>
                      </div>
                      {order.orderStatus.threeDworkStarted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "threeDworkStarted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">3D Work Completed</p>
                      </div>
                      {order.orderStatus.threeDworkCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "threeDworkCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Project Completed</p>
                      </div>
                      {order.orderStatus.projectCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>{" "}
                    <div className="divider"></div>
                    <div className="order-manual-flex bg-change-danger">
                      <div>
                        <p className="right-label">Payment Pending</p>
                      </div>
                      {order.orderStatus.paymentPending ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "paymentPending",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-danger">
                      <div>
                        <p className="right-label">cancelled</p>
                      </div>
                      {order.orderStatus.cancelled ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "cancelled",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </IonModal>
        </div>
      );
    } else if (order.purchasedPackage.paymentType === "only-1") {
      return (
        <div className="project-status-box">
          <IonCard>
            <div className="default-flex-box">
              <p>PROJECT STATUS</p>
              <IonBadge color="success">{order.status}</IonBadge>
              <IonButton
                onClick={() => setShowModal2(true)}
                size="small"
                color="secondary"
              >
                UPDATE NOW
              </IonButton>
            </div>
          </IonCard>

          <IonModal
            isOpen={showModal2}
            cssClass="status-modal"
            swipeToClose={true}
            onDidDismiss={() => setShowModal2(false)}
          >
            <div className="modal-body">
              <div className="modal-header">
                <p className="modal-header-text">PROJECT STATUS</p>
                <IonIcon
                  onClick={() => setShowModal2(false)}
                  className="modal-header-icon"
                  icon={closeOutline}
                />
              </div>

              <div className="modal-content">
                <div className="modal-content-inner">
                  <div className="first-section-status">
                    <IonItem
                      lines="none"
                      color="secondary"
                      style={{ borderRadius: "5px" }}
                    >
                      <IonLabel style={{ fontSize: "14px", fontWeight: "600" }}>
                        NOTIFICATION STATUS
                      </IonLabel>
                      <IonSelect
                        value={selectedStatusValue}
                        placeholder="select one"
                        onIonChange={(e) =>
                          projectStatusUpdate(
                            order._id,
                            order.orderedBy.mobileNumber,
                            e
                          )
                        }
                      >
                        {statusValues.map((s, i) => (
                          <IonSelectOption key={i} value={s}>
                            {s}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </div>

                  <div className="second-section-status">
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Order Confirmed</p>
                      </div>
                      {order.orderStatus.orderConfirmed ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "orderConfirmed",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-auto">
                      <div>
                        <p className="right-label">Engineer Assigned</p>
                      </div>
                      {order.orderStatus.engineerAssigned ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "engineerAssigned",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Floor Plan Ready</p>
                      </div>
                      {order.orderStatus.floorPlanReady ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "floorPlanReady",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Floor Plan Finalized</p>
                      </div>
                      {order.orderStatus.floorPlanFinalized ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "floorPlanFinalized",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex">
                      <div>
                        <p className="right-label">Project Completed</p>
                      </div>
                      {order.orderStatus.projectCompleted ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "projectCompleted",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>{" "}
                    <div className="divider"></div>
                    <div className="order-manual-flex bg-change-danger">
                      <div>
                        <p className="right-label">Payment Pending</p>
                      </div>
                      {order.orderStatus.paymentPending ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "paymentPending",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                    <div className="order-manual-flex bg-change-danger">
                      <div>
                        <p className="right-label">cancelled</p>
                      </div>
                      {order.orderStatus.cancelled ? (
                        <IonIcon color="success" icon={checkmarkDoneCircle} />
                      ) : (
                        <GiSandsOfTime className="pending-icon" />
                      )}
                      <div>
                        <IonSelect
                          interface="action-sheet"
                          placeholder="select one"
                          onIonChange={manualStatusHandle(
                            "cancelled",
                            order._id
                          )}
                        >
                          <IonSelectOption value={true}>
                            MARK AS DONE
                          </IonSelectOption>
                          <IonSelectOption value={false}>
                            MARK AS PENDING
                          </IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </IonModal>
        </div>
      );
    }
  };

  const addonPacks = (order) => {
    return (
      <>
        <IonCard style={{ marginTop: "10px" }} className="single-order-card">
          <IonCardHeader color="secondary">
            <IonCardTitle>ADDON PACKS</IonCardTitle>
          </IonCardHeader>
          {order.purchasedPack.activePack.length >= 1 ? (
            <div>
              {order.purchasedPack.activePack.map((p, i) => (
                <div key={i} className="active-pack-box">
                  <div className="pack-head">
                    <p>{p.packName}</p>
                  </div>
                  <div className="active-pack-flex">
                    <div>
                      <p>{p.title}</p>
                    </div>
                    <div className="payment-status-success">ACTIVE</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ion-text-center">No active pack</div>
          )}
        </IonCard>
      </>
    );
  };

  const overallPrice = (order) => {
    return (
      <IonCard style={{ marginTop: "10px" }} className="single-order-card">
        <IonCardHeader color="secondary">
          <IonCardTitle>OTHER INFO</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="default-flex-box">
            <p>Orginal Price:</p>
            <p>{order.priceList.orginalPrice}</p>
          </div>
          <div className="default-flex-box">
            <p>Purchased Price:</p>
            <p>{order.priceList.purchasedPrice}</p>
          </div>

          <div className="default-flex-box">
            <p>Ordered Time:</p>
            <p>{moment(order.createdAt).calendar()}</p>
          </div>
          <div className="default-flex-box">
            <p>Updated Time:</p>
            <p>{moment(order.updatedAt).calendar()}</p>
          </div>
          <div className="default-flex-box">
            <p>Coupon name:</p>
            <p>
              {order.discountType.name
                ? order.discountType.name
                : "no coupon applied"}
            </p>
          </div>
        </IonCardContent>
      </IonCard>
    );
  };
  return (
    <IonPage>
      <Header title="UPDATE ORDER" backButton={true} />
      <IonContent>
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => setLoading(false)}
          message={"Please wait..."}
        />

        {order && (
          <div className="default-page">
            {firstBlock(order)}
            {folderCreation(order)}
            {paymentStatus(order)}
            {projectStatus(order)}
            {addonPacks(order)}
            {overallPrice(order)}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default OrderById;
