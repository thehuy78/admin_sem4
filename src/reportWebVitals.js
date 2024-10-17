const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Logs Cumulative Layout Shift
      getFID(onPerfEntry); // Logs First Input Delay
      getFCP(onPerfEntry); // Logs First Contentful Paint
      getLCP(onPerfEntry); // Logs Largest Contentful Paint
      getTTFB(onPerfEntry); // Logs Time to First Byte
    });
  }
};

export default reportWebVitals;
