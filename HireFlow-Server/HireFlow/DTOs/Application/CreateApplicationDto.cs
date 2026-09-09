using System.ComponentModel.DataAnnotations;

namespace HireFlow.DTOs.Application;

public class CreateApplicationDto
{
    [Range(1, int.MaxValue)]
    public int JobId { get; set; }
}