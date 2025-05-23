
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExerciseState, ExerciseType, EXERCISES, RepState } from "@/services/exerciseService";
import { BadgeCheck, Dumbbell, AlertTriangle } from "lucide-react";

interface ExerciseStatsProps {
  exerciseState: ExerciseState;
  className?: string;
}

const ExerciseStats: React.FC<ExerciseStatsProps> = ({ exerciseState, className }) => {
const exerciseSettings = EXERCISES[exerciseState.type];
  const isResting = exerciseState.repState === RepState.RESTING;
  const repProgress = exerciseSettings.targetReps > 0
    ? (exerciseState.repCount / exerciseSettings.targetReps) * 100
    : 0;
  const setProgress = exerciseSettings.sets > 0
    ? ((exerciseState.setCount - 1) / exerciseSettings.sets) * 100
    : 0;
  const settings = exerciseSettings;
  const progress = settings.sets > 0 
    // Calculate progress based on completed sets
    ? (exerciseState.setCount / settings.sets) * 100 
    : 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-primary" />
            {exerciseState.type !== ExerciseType.NONE 
              ? settings.name 
              : "No Exercise Detected"}
          </div>
          {exerciseState.type !== ExerciseType.NONE && (
            <div className="text-sm font-normal text-muted-foreground">
              Set {exerciseState.setCount} of {settings.sets}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exerciseState.type !== ExerciseType.NONE ? (
          <>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    {isResting ? "Rest Time" : "Reps"}
                  </span>
                  <span className="text-sm font-medium">
                    {isResting 
                      ? `${settings.restBetweenSets}s` 
                      : `${exerciseState.repCount} / ${settings.targetReps}`}
                  </span>
                </div>
                <Progress value={repProgress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Sets Completed</span>
                  <span className="text-sm font-medium">
                    {Math.max(0, exerciseState.setCount - 1)} / {settings.sets}
                  </span>
                </div>
                <Progress value={setProgress} className="h-2" />
              </div>
              
              {exerciseState.formFeedback.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    {exerciseState.formFeedback.some(f => f.includes('complete') || f.includes('Rest')) 
                      ? <BadgeCheck className="w-4 h-4 mr-1 text-success" />
                      : <AlertTriangle className="w-4 h-4 mr-1 text-warning" />}
                    Feedback
                  </h4>
                  <ul className="space-y-1">
                    {exerciseState.formFeedback.map((feedback, index) => (
                      <li key={index} className="text-sm text-left">
                        • {feedback}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-4">
                <h4 className="font-medium mb-1">Muscles Targeted:</h4>
                <p>{settings.musclesTargeted.join(', ')}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            <p>Get into position to begin tracking your exercise</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseStats;
