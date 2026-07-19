import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("upload", "routes/UploadResume.tsx"),
  route("resume/:id", "routes/ResumeDetails.tsx")
] satisfies RouteConfig;
