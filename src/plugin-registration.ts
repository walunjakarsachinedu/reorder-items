import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { dragNDropPlugin } from "drag-and-drop-plugin";
import { useGSAP } from "@gsap/react";


function registerPlugins() {
  gsap.registerPlugin(Flip);
  dragNDropPlugin.enablePlugin();
  gsap.registerPlugin(useGSAP);

}

export { registerPlugins };