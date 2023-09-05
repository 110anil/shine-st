import {changeTags} from "@/pages/api/get-files";

export default function handler (req, res) {
    changeTags(req, res)
}
