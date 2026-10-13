import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * حاجز أخطاء بسيط: إذا فشل مكوّن تجميلي (مثل الجزيئات) في جهاز تلفزيون
 * معيّن، يكمل المنيو عمله دون شاشة سوداء.
 */
export class SafeLayer extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[menu] تم تجاوز طبقة فاشلة:', error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
