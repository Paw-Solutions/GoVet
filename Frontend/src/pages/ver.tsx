import React, { useState } from "react";
import {
  IonPage,
  IonContent,
} from "@ionic/react";
import "../styles/main.css";
import { useSegmentedData } from "../hooks/useSegmentedData";
import PageHeader from "../components/common/PageHeader";
import SegmentedView from "../components/common/SegmentedView";
import TutoresList from "../components/ver/TutoresList";
import PacientesList from "../components/ver/PacientesList";
import ModalsContainer from "../components/ver/ModalsContainer";

const Ver: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState("pacientes");
  const { tutores, pacientes } = useSegmentedData(selectedSegment);

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
    
    if (segment === 'pacientes' && pacientes.data.length === 0 && !pacientes.loading) {
      pacientes.loadData();
    }
  };
  
  return (
    <IonPage>
      <PageHeader 
        title="Ver Tutores y Pacientes"
        onRefresh={() => selectedSegment === "tutores" ? tutores.refresh() : pacientes.refresh()}
        loading={selectedSegment === "tutores" ? tutores.loading : pacientes.loading}
      />

      <IonContent fullscreen={true}>
        <SegmentedView
          selectedSegment={selectedSegment}
          onSegmentChange={handleSegmentChange}
        >
          {selectedSegment === "tutores" && (
            <TutoresList 
              tutores={tutores.data}
              loading={tutores.loading}
              error={tutores.error}
              busqueda={tutores.busqueda}
              hasMoreData={tutores.hasMoreData}
              onSearch={tutores.handleSearch}
              onRefresh={tutores.refresh}
              onLoadMore={tutores.loadMore}
              onViewTutor={tutores.viewTutor}
              onEditTutor={tutores.editTutor}
              onRetry={tutores.retry}
            />
          )}
          
          {selectedSegment === "pacientes" && (
            <PacientesList 
              pacientes={pacientes.data}
              loading={pacientes.loading}
              error={pacientes.error}
              busqueda={pacientes.busqueda}
              hasMoreData={pacientes.hasMoreData}
              onSearch={pacientes.handleSearch}
              onRefresh={pacientes.refresh}
              onLoadMore={pacientes.loadMore}
              onViewPaciente={pacientes.viewPaciente}
              onEditPaciente={pacientes.editPaciente}
              onRetry={pacientes.retry}
            />
          )}
        </SegmentedView>
      </IonContent>

      <ModalsContainer
        // Tutores
        showTutorInfo={tutores.showTutorInfo}
        selectedTutor={tutores.selectedTutor}
        onCloseTutorInfo={tutores.closeTutorInfo}
        // Pacientes
        showPacienteInfo={pacientes.showPacienteInfo}
        selectedPaciente={pacientes.selectedPaciente}
        onClosePacienteInfo={pacientes.closePacienteInfo}
      />
    </IonPage>
  );
};

export default Ver;