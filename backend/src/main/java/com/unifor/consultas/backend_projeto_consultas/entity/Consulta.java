package com.unifor.consultas.backend_projeto_consultas.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Consulta {

    private Long id;
    private LocalDate data;
    private LocalTime horario;
    private String status;
    private String tipoConsulta;
}
