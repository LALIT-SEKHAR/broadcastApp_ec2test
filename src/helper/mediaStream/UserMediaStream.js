export const getUserMediaStream = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (error) {
    alert(error.message);
  }
};
