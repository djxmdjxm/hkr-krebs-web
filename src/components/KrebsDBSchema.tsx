"use client";

import React from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    } 
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    } 
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
  fontFamily: "Fira Code",
});

function Mermaid() {
  mermaid.contentLoaded();

  return <div className="mermaid">{KrebsDBSchema}</div>;
}

export default Mermaid;

const KrebsDBSchema = `
classDiagram
direction BT
class patient_report {
   varchar patient_id  /* Patient:Patient_ID */
   varchar gender  /* Patienten_Stammdaten:Geschlecht */
   date date_of_birth  /* Patienten_Stammdaten:Geburtsdatum */
   varchar date_of_birth_accuracy  /* Patienten_Stammdaten:Geburtsdatum:Datumsgenauigkeit */
   boolean is_deceased  /* Patienten_Stammdaten:Vitalstatus:Verstorben */
   date vital_status_date  /* Patienten_Stammdaten:Vitalstatus:Datum_Vitalstatus */
   varchar vital_status_date_accuracy  /* Patienten_Stammdaten:Vitalstatus:Datumsgenauigkeit */
   jsonb death_causes  /* Patienten_Stammdaten:Vitalstatus:Todesursachen */
   varchar register  /* Lieferregister */
   date reported_at  /* Lieferdatum */
   timestamp updated_at
   timestamp created_at
   integer id
}
class radiotherapy_session {
   integer tumor_radiotherapy_id
   date start_date  /* Bestrahlung:Datum_Beginn_Bestrahlung */
   varchar start_date_accuracy  /* Bestrahlung:Datum_Beginn_Bestrahlung:Datumsgenauigkeit */
   integer duration_days  /* Bestrahlung:Anzahl_Tage_ST_Dauer */
   varchar target_area  /* Bestrahlung:Applikationsart:Zielgebiet */
   varchar laterality  /* Bestrahlung:Applikationsart:Seite_Zielgebiet */
   timestamp updated_at
   timestamp created_at
   integer id
}
class radiotherapy_session_brachytherapy {
   varchar type  /* Bestrahlung:Kontakt:Interstitiell_endokavitaer */
   varchar dose_rate  /* Bestrahlung:Kontakt:Rate_Type */
   timestamp updated_at
   timestamp created_at
   integer radiotherapy_session_id
}
class radiotherapy_session_metabolic {
   varchar type  /* Metabolisch_Typ */
   timestamp updated_at
   timestamp created_at
   integer radiotherapy_session_id
}
class radiotherapy_session_percutaneous {
   varchar chemoradio  /* Bestrahlung:Perkutan:Radiochemo */
   boolean stereotactic  /* Bestrahlung:Perkutan:Stereotaktisch */
   boolean respiratory_gated  /* Bestrahlung:Perkutan:Atemgetriggert */
   timestamp updated_at
   timestamp created_at
   integer radiotherapy_session_id
}
class tnm {
   varchar version  /* TNM:Version */
   boolean y_symbol  /* TNM:y_Symbol */
   boolean r_symbol  /* TNM:r_Symbol */
   boolean a_symbol  /* TNM:a_Symbol */
   varchar t_prefix  /* TNM:c_p_u_Praefix_T */
   varchar t  /* TNM:T */
   varchar m_symbol  /* TNM:m_Symbol */
   varchar n_prefix  /* TNM:c_p_u_Praefix_N */
   varchar n  /* TNM:N */
   varchar m_prefix  /* TNM:c_p_u_Praefix_M */
   varchar m  /* TNM:M */
   varchar l  /* TNM:L */
   varchar v  /* TNM:V */
   varchar pn  /* TNM:Pn */
   varchar s  /* TNM:S */
   varchar uicc_stage  /* TNM:UICC_Stadium */
   timestamp updated_at
   timestamp created_at
   integer id
}
class tumor_follow_up {
   integer tumor_report_id
   integer tnm_id  /* Folgeereignis:TNM */
   jsonb other_classification  /* Folgeereignis:Menge_Weitere_Klassifikation */
   date date  /* Folgeereignis:Datum_Folgeereignis */
   varchar date_accuracy  /* Folgeereignis:Datum_Folgeereignis:Datumsgenauigkeit */
   varchar overall_tumor_status  /* Folgeereignis:Gesamtbeurteilung_Tumorstatus */
   varchar local_tumor_status  /* Folgeereignis:Verlauf_Lokaler_Tumorstatus */
   varchar lymph_node_tumor_status  /* Folgeereignis:Verlauf_Tumorstatus_Lymphknoten */
   varchar distant_metastasis_tumor_status  /* Folgeereignis:Verlauf_Tumorstatus_Fernmetastasen */
   jsonb distant_metastasis  /* Folgeereignis:Menge_FM */
   timestamp updated_at
   timestamp created_at
   integer id
}
class tumor_histology {
   jsonb morphology_icd  /* Primaerdiagnose:Histologie:Morphologie_ICD_O */
   varchar grading  /* Primaerdiagnose:Histologie:Grading */
   integer lymph_nodes_examined  /* Primaerdiagnose:Histologie:LK_untersucht */
   integer lymph_nodes_affected  /* Primaerdiagnose:Histologie:LK_befallen */
   timestamp updated_at
   timestamp created_at
   integer tumor_report_id
}
class tumor_radiotherapy {
   integer tumor_report_id
   varchar intent  /* ST:Intention */
   varchar surgery_relation  /* ST:Stellung_OP */
   timestamp updated_at
   timestamp created_at
   integer id
}
class tumor_report {
   integer patient_report_id
   varchar tumor_id  /* Tumor_ID */
   date diagnosis_date  /* Primaerdiagnose:Diagnosedatum */
   varchar diagnosis_date_accuracy  /* Primaerdiagnose:Diagnosedatum:Datumsgenauigkeit */
   varchar incidence_location  /* Primaerdiagnose:Inzidenzort */
   jsonb icd  /* Primaerdiagnose:Primaertumor_ICD */
   jsonb topographie  /* Primaerdiagnose:Primaertumor_Topographie_ICD_O */
   varchar diagnostic_certainty  /* Primaerdiagnose:Diagnosesicherung */
   integer c_tnm_id  /* Primaerdiagnose:cTNM */
   integer p_tnm_id  /* Primaerdiagnose:pTNM */
   jsonb distant_metastasis  /* Primaerdiagnose:Menge_FM */
   jsonb other_classification  /* Primaerdiagnose:Menge_Weitere_Klassifikation */
   varchar laterality  /* Primaerdiagnose:Seitenlokalisation */
   timestamp updated_at
   timestamp created_at
   integer id
}
class tumor_report_breast {
   varchar menopause_status_at_diagnosis  /* Modul_Mamma:Praetherapeutischer_Menopausenstatus */
   varchar estrogen_receptor_status  /* Modul_Mamma:HormonrezeptorStatus_Oestrogen */
   varchar progesterone_receptor_status  /* Modul_Mamma:HormonrezeptorStatus_Progesteron */
   varchar her2neu_status  /* Modul_Mamma:Her2neuStatus */
   integer tumor_size_mm_invasive  /* Modul_Mamma:TumorgroesseInvasiv */
   integer tumor_size_mm_dcis  /* Modul_Mamma:TumorgroesseDCIS */
   timestamp updated_at
   timestamp created_at
   integer tumor_report_id
}
class tumor_report_colorectal {
   varchar ras_mutation  /* Modul_Darm:RASMutation */
   integer rectum_distance_anocutaneous_line_cm  /* Modul_Darm:RektumAbstandAnokutanlinie */
   timestamp updated_at
   timestamp created_at
   integer tumor_report_id
}
class tumor_report_melanoma {
   numeric(4,1) tumor_thickness_mm  /* Modul_Malignes_Melanom:Tumordicke */
   numeric(10,3) ldh  /* Modul_Malignes_Melanom:Tumordicke */
   boolean ulceration  /* Modul_Malignes_Melanom:Ulzeration */
   timestamp updated_at
   timestamp created_at
   integer tumor_report_id
}
class tumor_report_prostate {
   varchar gleason_primary_grade  /* Modul_Prostata:GleasonScore:GradPrimaer */
   varchar gleason_secondary_grade  /* Modul_Prostata:GleasonScore:GradSekundaer */
   varchar gleason_score_result  /* Modul_Prostata:GleasonScore:ScoreErgebnis */
   varchar gleason_score_reason  /* Modul_Prostata:AnlassGleasonScore */
   numeric(10,3) psa  /* Modul_Prostata:PSA */
   date psa_date  /* Modul_Prostata:DatumPSA */
   varchar psa_date_accuracy  /* Modul_Prostata:DatumPSA:Datumsgenauigkeit */
   timestamp updated_at
   timestamp created_at
   integer tumor_report_id
}
class tumor_surgery {
   integer tumor_report_id
   varchar intent  /* OP:Intention */
   date date  /* OP:Datum */
   varchar date_accuracy  /* OP:Datumsgenauigkeit */
   jsonb operations  /* OP:Menge_OPS */
   varchar local_residual_status  /* OP:Lokale_Beurteilung_Residualstatus */
   timestamp updated_at
   timestamp created_at
   integer id
}
class tumor_systemic_therapy {
   integer tumor_report_id
   date start_date  /* SYST:Datum_Beginn_SYST */
   varchar start_date_accuracy  /* SYST:Datum_Beginn_SYST:Datumsgenauigkeit */
   integer duration_days  /* SYST:Anzahl_Tage_SYST_Dauer */
   varchar intent  /* SYST:Intention */
   varchar surgery_relation  /* SYST:Stellung_OP */
   varchar type  /* SYST:Therapieart */
   jsonb protocol  /* SYST:Protokoll */
   jsonb drugs  /* SYST:Menge_Substanz:Substanz */
   timestamp updated_at
   timestamp created_at
   integer id
}

radiotherapy_session "*" --> "1" tumor_radiotherapy
radiotherapy_session_brachytherapy --|> radiotherapy_session
radiotherapy_session_metabolic  --|>  radiotherapy_session
radiotherapy_session_percutaneous  --|>  radiotherapy_session
tumor_follow_up "1" --> "1" tnm
tumor_follow_up "*" --> "1" tumor_report
tumor_histology "1" --> "1" tumor_report
tumor_radiotherapy "*" --> "1"  tumor_report
tumor_report  -->  patient_report
tumor_report  "1" --> "2" tnm
tumor_report_breast  --|>  tumor_report
tumor_report_colorectal  --|>  tumor_report
tumor_report_melanoma  --|>  tumor_report
tumor_report_prostate  --|>  tumor_report
tumor_surgery "*" --> "1" tumor_report
tumor_systemic_therapy "*" --> "1" tumor_report


`;
