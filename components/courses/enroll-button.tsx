'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLearning } from '@/components/providers/learning-provider';
import type { Course } from '@/types';

interface EnrollButtonProps {
  course: Course;
}

export function EnrollButton({ course }: EnrollButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const {
    isAuthenticated,
    isEnrolled,
    enroll,
    getProgress,
    getResumeLesson,
  } = useLearning();

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const resumeLesson = getResumeLesson(course);

  if (!isAuthenticated) {
    return (
      <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push('/login')}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign in to Enroll
      </Button>
    );
  }

  if (!enrolled) {
    const handleEnroll = async () => {
      setBusy(true);
      const ok = await enroll(course.id, course);
      setBusy(false);
      if (!ok) {
        toast({
          title: 'Could not enroll',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Enrolled successfully',
        description: `${course.title} has been added to your learning dashboard.`,
      });
    };
    return (
      <Button
        size="lg"
        className="w-full sm:w-auto"
        onClick={handleEnroll}
        disabled={busy}
      >
        {busy ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Enroll in Course
      </Button>
    );
  }

  if (progress.percent === 100) {
    return (
      <Button size="lg" variant="outline" className="w-full sm:w-auto" disabled>
        <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
        Course Completed
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => {
        if (!resumeLesson) return;
        router.push(`/learn/${course.slug}/${resumeLesson.slug}`);
      }}
      disabled={!resumeLesson}
    >
      <Play className="mr-2 h-4 w-4" />
      Continue Learning
      <span className="ml-2 text-xs font-normal opacity-80">
        {progress.percent}% complete
      </span>
    </Button>
  );
}

export function MarkCompleteToggle({
  courseId,
  lessonId,
  lessonTitle,
  isLast,
  nextHref,
}: {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  isLast: boolean;
  nextHref: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const { isLessonComplete, markLessonComplete, markLessonIncomplete } =
    useLearning();
  const complete = isLessonComplete(courseId, lessonId);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    if (!complete) {
      const ok = await markLessonComplete(courseId, lessonId);
      setBusy(false);
      if (!ok) {
        toast({
          title: 'Could not save progress',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Lesson marked complete',
        description: lessonTitle,
      });
      if (nextHref) {
        setTimeout(() => router.push(nextHref), 400);
      } else if (isLast) {
        toast({
          title: 'Course completed',
          description: 'Nice work — this course is finished.',
        });
      }
    } else {
      const ok = await markLessonIncomplete(courseId, lessonId);
      setBusy(false);
      if (!ok) {
        toast({
          title: 'Could not update progress',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Button
      variant={complete ? 'outline' : 'default'}
      size="sm"
      onClick={toggle}
      disabled={busy}
      className="w-full sm:w-auto"
    >
      {busy ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : complete ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
          Completed
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark as Complete
        </>
      )}
    </Button>
  );
}
