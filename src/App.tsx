import { ConfigProvider, theme } from "antd";
import Home from "./components/Home";
import "./App.css";

function App() {
  const { darkAlgorithm } = theme;

  console.log(`${process.env.REACT_APP_ENDPOINT}inventory`);

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Home />
      </ConfigProvider>
    </>
  );
}

export default App;