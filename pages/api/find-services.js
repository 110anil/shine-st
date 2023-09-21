import {findServices} from "@/pages/api/get-files";
export default function handler (req, res) {
    findServices(req, res)
}
