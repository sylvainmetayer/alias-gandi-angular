import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * @see https://stackoverflow.com/a/52949299
 */
@Directive({ selector: '[appCopyClipboard]' })
export class CopyClipboardDirective {

  @Input('appCopyClipboard')
  public payload: string;

  @Output()
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {

    event.preventDefault();
    if (!this.payload) {
      return;
    }

    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      clipboard.setData('text', this.payload.toString());
      e.preventDefault();

      this.copied.emit(this.payload);
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
}
