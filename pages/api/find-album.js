import {findAlbum} from "@/pages/api/get-files";

export default function handler (req, res) {
    findAlbum(req, res)
}
