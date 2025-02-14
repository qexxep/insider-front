import { useToast } from '@/shared/hooks/use-toast';

interface ErrorToastProps {
  title?: string;
  description?: string;
}

export function showErrorToast({ title = 'Unhandled Error', description }: ErrorToastProps) {
  const { toast } = useToast();

  toast({
    variant: 'destructive',
    title,
    description: description || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  });
}
