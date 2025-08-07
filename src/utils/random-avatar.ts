
import avatar1 from "@/assets/images/avatar/avatar_1.png";
import avatar2 from "@/assets/images/avatar/avatar_2.png";
import avatar3 from "@/assets/images/avatar/avatar_3.png";

const profileImages = [
    avatar1,
    avatar2,
    avatar3,
];

const randomIndex = Math.floor(Math.random() * profileImages.length);

export { profileImages, randomIndex } 