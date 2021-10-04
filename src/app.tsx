import React from "react";

const App = () => {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        React App
      </h1>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <div>Sample image</div>
        <img src="/public/assets/sample.jpg" alt="img" />
      </div>
    </div>
  );
};

export default App;
