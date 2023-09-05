import {changeTitle} from "@/pages/api/get-files";

export default function handler (req, res) {
    changeTitle(req, res)
}
