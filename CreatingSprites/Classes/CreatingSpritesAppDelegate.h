//
//  CreatingSpritesAppDelegate.h
//  CreatingSprites
//
//  Created by Boydlee Pollentine on 30/01/11.
//  Copyright Boydlee Pollentine 2011. All rights reserved.
//

#import <UIKit/UIKit.h>

@class RootViewController;

@interface CreatingSpritesAppDelegate : NSObject <UIApplicationDelegate> {
	UIWindow			*window;
	RootViewController	*viewController;
}

@property (nonatomic, retain) UIWindow *window;

@end
