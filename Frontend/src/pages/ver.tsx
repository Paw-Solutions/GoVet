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
import FichasList from "../components/ver/FichasList"
import ModalsContainer from "../components/ver/ModalsContainer";

const Ver: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState("pacientes");
  const { tutores, pacientes, fichas } = useSegmentedData(selectedSegment);

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
  };
  
  return (
    <IonPage>
      <PageHeader 
        title="Ver Tutores y Pacientes"
        onRefresh={() => {
          if (selectedSegment === 'tutores') return tutores.refresh();
          if (selectedSegment === 'pacientes') return pacientes.refresh();
          if (selectedSegment === 'fichas') return fichas.refresh();
        }}
        loading={
          selectedSegment === 'tutores' ? tutores.loading :
          selectedSegment === 'pacientes' ? pacientes.loading :
          fichas.loading
        }
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

          {selectedSegment === "fichas" && (
            <FichasList
              fichas={fichas.data}
              loading={fichas.loading}
              error={fichas.error}
              busqueda={fichas.busqueda}
              hasMoreData={fichas.hasMoreData}
              onSearch={fichas.handleSearch}
              onRefresh={fichas.refresh}
              onLoadMore={fichas.loadMore}
              onViewFicha={fichas.viewFicha}
              onEditFicha={fichas.editFicha}
              onExportFicha={fichas.exportFicha}
              onRetry={fichas.retry}
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

        showFichaInfo={fichas.showFichaInfo}
        selectedFicha={fichas.selectedFicha}
        onCloseFichaInfo={fichas.closeFichaInfo}
      />
    </IonPage>
  );
};

export default Ver;