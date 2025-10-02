import { useContext } from "react";
import { AxiosContext } from "../contexts/AxiosContext.jsx";

export const useAxios = () => useContext(AxiosContext);