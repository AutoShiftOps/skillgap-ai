import { computeMatchPercentages } from "../extraction";
import type { SkillGapItem } from "../types";

describe("computeMatchPercentages", () => {
  it("returns 0s for an empty gap list", () => {
    const result = computeMatchPercentages([]);
    expect(result).toEqual({
      matchPercentage: 0,
      technicalMatchPercentage: 0,
      managerialMatchPercentage: 0
    });
  });

  it("computes 100% when all skills match", () => {
    const gaps: SkillGapItem[] = [
      { skill: "AWS", category: "technical", status: "match" },
      { skill: "Leadership", category: "managerial", status: "match" }
    ];
    const result = computeMatchPercentages(gaps);
    expect(result.matchPercentage).toBe(100);
    expect(result.technicalMatchPercentage).toBe(100);
    expect(result.managerialMatchPercentage).toBe(100);
  });

  it("weights partial matches at 50%", () => {
    const gaps: SkillGapItem[] = [
      { skill: "AWS", category: "technical", status: "match" },
      { skill: "Kubernetes", category: "technical", status: "partial" },
      { skill: "Docker", category: "technical", status: "missing" }
    ];
    const result = computeMatchPercentages(gaps);
    expect(result.technicalMatchPercentage).toBe(50);
  });

  it("computes technical and managerial percentages independently", () => {
    const gaps: SkillGapItem[] = [
      { skill: "AWS", category: "technical", status: "match" },
      { skill: "Team leadership", category: "managerial", status: "missing" }
    ];
    const result = computeMatchPercentages(gaps);
    expect(result.technicalMatchPercentage).toBe(100);
    expect(result.managerialMatchPercentage).toBe(0);
    expect(result.matchPercentage).toBe(50);
  });
});
