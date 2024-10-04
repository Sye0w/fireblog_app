import { Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private analytics: Analytics) {}

  logPostView(postId: string, postTitle: string) {
    logEvent(this.analytics, 'post_view', {
      post_id: postId,
      post_title: postTitle
    });
  }

  logCommentToggle(postId: string, isExpanded: boolean) {
    logEvent(this.analytics, 'comment_section_toggle', {
      post_id: postId,
      is_expanded: isExpanded
    });
  }

  logCommentAdded(postId: string) {
    logEvent(this.analytics, 'comment_added', {
      post_id: postId
    });
  }

  logCustomEvent(eventName: string, eventParams: Record<string, any>) {
    logEvent(this.analytics, eventName, eventParams);
  }
}
