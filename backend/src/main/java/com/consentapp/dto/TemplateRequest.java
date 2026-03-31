package com.consentapp.dto;

import java.util.List;
import jakarta.validation.constraints.NotBlank;

public class TemplateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Content is required")
    private String content;

    private Boolean active = true;

    private List<Long> assignedStudentIds;

    public TemplateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public List<Long> getAssignedStudentIds() { return assignedStudentIds; }
    public void setAssignedStudentIds(List<Long> assignedStudentIds) { this.assignedStudentIds = assignedStudentIds; }
}
