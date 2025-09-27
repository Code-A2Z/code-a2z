import { model } from "mongoose";
import projectSchema from "../schemas/project.schema";

const Project = model("projects", projectSchema);

export default Project;
