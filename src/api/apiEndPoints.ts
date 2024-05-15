import axios from "axios";
import { Item } from "../components/Home";

const apiInventory = `${process.env.REACT_APP_ENDPOINT}inventory`; //link from the .env file

const apiHealthCheck = `${process.env.REACT_APP_ENDPOINT}check`; //link from the .env file

const apiCars = `${process.env.REACT_APP_ENDPOINT}car`; //link from the .env file

//function to generate random ID:
const id = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getInventory = () => {
  axios
    .get(apiInventory)
    .then((response) => {
      return response.data.inventory;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const healthCheck = () => {
  axios
    .get(apiHealthCheck)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getCar = () => {
  axios
    .get(apiCars)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const postCar = (value: Item) => {
  axios
    .post(
      apiCars,
      {
        model: value.model,
        maker: value.maker,
        engineCyl: value.engineCyl,
        rating: value.rating,
        mpgHighway: value.mpgHighway,
        year: value.year,
        id: id(),
        mpgCity: value.mpgCity,
        mpgCombined: value.mpgCombined,
        engineSize: value.engineSize,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const putCar = (value: Item) => {
  axios
    .post(
      apiCars,
      {
        model: value.model,
        maker: value.maker,
        engineCyl: value.engineCyl,
        rating: value.rating,
        mpgHighway: value.mpgHighway,
        year: value.year,
        id: value.id,
        mpgCity: value.mpgCity,
        mpgCombined: value.mpgCombined,
        engineSize: value.engineSize,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteCar = async (id: string) => {
  const data = JSON.stringify({
    id: id,
  });

  const config = {
    method: "delete",
    url: apiCars,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};