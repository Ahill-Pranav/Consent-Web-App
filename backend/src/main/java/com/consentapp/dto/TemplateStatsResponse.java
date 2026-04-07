package com.consentapp.dto;

import java.util.List;

public class TemplateStatsResponse {
    private int totalAssigned;
    private int totalSigned;
    private int totalPending;
    private List<StudentStatusDto> students;

    public TemplateStatsResponse() {}

    public TemplateStatsResponse(int totalAssigned, int totalSigned, int totalPending, List<StudentStatusDto> students) {
        this.totalAssigned = totalAssigned;
        this.totalSigned = totalSigned;
        this.totalPending = totalPending;
        this.students = students;
    }

    public int getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(int totalAssigned) { this.totalAssigned = totalAssigned; }
    public int getTotalSigned() { return totalSigned; }
    public void setTotalSigned(int totalSigned) { this.totalSigned = totalSigned; }
    public int getTotalPending() { return totalPending; }
    public void setTotalPending(int totalPending) { this.totalPending = totalPending; }
    public List<StudentStatusDto> getStudents() { return students; }
    public void setStudents(List<StudentStatusDto> students) { this.students = students; }
}
