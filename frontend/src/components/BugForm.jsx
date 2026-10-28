import { useState } from "react";
import { request } from "../api/api";
import { SEVERITIES, PRIORITIES } from "../utils/constants";

const emptyForm = {
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedResult: "",
    actualResult: "",
    environment: "",
    severity: "Minor",
    priority: "Medium",
};

export default BugForm;