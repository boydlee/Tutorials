//
//  HelloWorldLayer.m
//  CreatingSprites
//
//  Created by Boydlee Pollentine on 30/01/11.
//  Copyright Boydlee Pollentine 2011. All rights reserved.
//

// Import the interfaces
#import "HelloWorldScene.h"

// HelloWorld implementation
@implementation HelloWorld

+(id) scene
{
	// 'scene' is an autorelease object.
	CCScene *scene = [CCScene node];
	
	// 'layer' is an autorelease object.
	HelloWorld *layer = [HelloWorld node];
	
	// add layer as a child to scene
	[scene addChild: layer];
	
	// return the scene
	return scene;
}

// on "init" you need to initialize your instance
-(id) init
{
	// always call "super" init
	// Apple recommends to re-assign "self" with the "super" return value
	if( (self=[super init] )) {
		
		//Determine where to spawn the target along the Y axis
		CGSize winSize = [[CCDirector sharedDirector] winSize];
		
		//Declare our sprite
		CCSprite *presentSprite = [CCSprite spriteWithFile:@"present1.png" rect:CGRectMake(0, 0, 25, 30)];		
		presentSprite.position = ccp(winSize.width/2, winSize.height/2);
		
		//Create the rotation action
		CCRotateTo * rotLeft = [CCRotateBy actionWithDuration:0.1 angle:-4.0];
		CCRotateTo * rotCenter = [CCRotateBy actionWithDuration:0.1 angle:0.0];
		CCRotateTo * rotRight = [CCRotateBy actionWithDuration:0.1 angle:4.0];
		CCSequence * rotSeq = [CCSequence actions:rotLeft, rotCenter, rotRight, rotCenter, nil];
		[presentSprite runAction:[CCRepeatForever actionWithAction:rotSeq]];      
		
		// Create the movement action
		id actionMove = [CCMoveTo actionWithDuration:2.0 position:ccp(presentSprite.position.x, -50)];
		id actionMoveDone = [CCCallFuncN actionWithTarget:self selector:@selector(spriteMoveFinished:)];
		[presentSprite runAction:[CCSequence actions:actionMove, actionMoveDone, nil]];
		
		
		//Show our sprite on screen
		[self addChild:presentSprite];			
	}
	return self;
}

//remove the sprite when the action has completed
-(void)spriteMoveFinished:(id)sender {	
	CCSprite *sprite = (CCSprite *)sender;
	[self removeChild:sprite cleanup:YES];
}

// on "dealloc" you need to release all your retained objects
- (void) dealloc
{
	// in case you have something to dealloc, do it in this method
	// in this particular example nothing needs to be released.
	// cocos2d will automatically release all the children (Label)
	
	// don't forget to call "super dealloc"
	[super dealloc];
}
@end
