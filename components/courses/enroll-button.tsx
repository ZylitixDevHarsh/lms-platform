'use client';

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
  const {
    isAuthenticated,
    isEnrolled,
    enroll,
    getProgress,
    markLessonComplete,
  } = useLearning();

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const firstLesson = course.lessons ? course.lessons[0] : [];
  const resumeLesson =
    course.lessons?.find((l, i) => {
      const completed = enrolled && i < progress.completed;
      return !completed;
    }) ?? firstLesson;

  if (!isAuthenticated) {
    return (
      <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push('/login')}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign in to Enroll
      </Button>
    );
  }

  if (!enrolled) {
    const handleEnroll = () => {
      enroll(course.id);
      toast({
        title: 'Enrolled successfully',
        description: `${course.title} has been added to your learning dashboard.`,
      });
    };
    return (
      <Button size="lg" className="w-full sm:w-auto" onClick={handleEnroll}>
        <Play className="mr-2 h-4 w-4" />
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
      onClick={() =>
        router.push(`/learn/${course.slug}/${resumeLesson.slug}`)
      }
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
  const { isLessonComplete, markLessonComplete, markLessonIncomplete } =
    useLearning();
  const complete = isLessonComplete(courseId, lessonId);

  const toggle = () => {
    if (!complete) {
      markLessonComplete(courseId, lessonId);
      toast({
        title: 'Lesson marked complete',
        description: lessonTitle,
      });
      if (nextHref) {
        setTimeout(() => router.push(nextHref), 400);
      }
    } else {
      markLessonIncomplete(courseId, lessonId);
    }
  };

  return (
    <Button
      variant={complete ? 'outline' : 'default'}
      size="sm"
      onClick={toggle}
      className="w-full sm:w-auto"
    >
      {complete ? (
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
