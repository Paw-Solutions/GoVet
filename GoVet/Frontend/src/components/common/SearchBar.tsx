import React from "react";
import { IonSearchbar } from "@ionic/react";
import "../../styles/SearchBar.css";

interface SearchBarProps {
  value: string;
  onSearch: (texto: string) => void;
  placeholder: string;
  className?: string;
  fixed?: boolean; // ← Nueva prop para controlar si es fija
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onSearch, 
  placeholder, 
  className,
  fixed = true
}) => {
  return (
    <div className="modal-search-container">
      <IonSearchbar
        value={value}
        onIonInput={(e) => onSearch(e.detail.value!)}
        placeholder={placeholder}
        showClearButton="focus"
        className={className}
      />
    </div>
  );
};

export default SearchBar;