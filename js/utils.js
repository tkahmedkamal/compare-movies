// Make your javaScript wait for your user to finish typing
const _debounce = (callback, delay = 1000) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};
