import { useState } from 'react';
import SearchIcon from '@/components/common/icons/SearchIcon';
import TextInput from '@/components/common/TextInput/TextInput';
import styles from "./styles.module.css";


export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className={styles.search_container}>
            <TextInput
                isLabel={false}
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..." />
            <SearchIcon />
        </div>
    );
}