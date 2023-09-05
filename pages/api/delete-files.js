import {deleteFiles} from "@/pages/api/get-files";

export default function handler (req, res) {
    deleteFiles(req, res)
}
