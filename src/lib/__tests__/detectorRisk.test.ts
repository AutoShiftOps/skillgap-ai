import { assessDetectorRisk } from "../detectorRisk";

describe("assessDetectorRisk", () => {
  it("returns low risk for plain, specific text", () => {
    const text =
      "I built a Terraform module that cut provisioning time by 60%. It replaced a manual process that took our team two days per environment.";
    const result = assessDetectorRisk(text);
    expect(result.riskLevel).toBe("low");
    expect(result.flags.length).toBe(0);
  });

  it("flags overused AI-writing phrases", () => {
    const text =
      "I leveraged my skills to spearhead a robust solution and unlock potential across the team.";
    const result = assessDetectorRisk(text);
    expect(result.flags.length).toBeGreaterThanOrEqual(3);
    expect(result.riskLevel).not.toBe("low");
  });

  it("flags the word tapestry as a strong AI-writing tell", () => {
    const text = "My career has been a tapestry of diverse technical experiences.";
    const result = assessDetectorRisk(text);
    expect(result.flags.some((f) => f.pattern.includes("tapestry"))).toBe(true);
  });

  it("escalates to high risk with 4+ distinct flags", () => {
    const text =
      "I leveraged synergy to spearhead a holistic, robust solution that helped unlock potential in a fast-paced environment.";
    const result = assessDetectorRisk(text);
    expect(result.riskLevel).toBe("high");
  });
});
