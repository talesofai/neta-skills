#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { getHashtagCharactersCommand } from './commands/community/get-hashtag-characters.ts';
import { getHashtagCollectionsCommand } from './commands/community/get-hashtag-collections.ts';
import { getHashtagInfoCommand } from './commands/community/get-hashtag-info.ts';
import { makeImageCommand } from './commands/make-image.ts';
import { makeSongCommand } from './commands/make-song.ts';
import { makeVideoCommand } from './commands/make-video.ts';
import { mergeVideoCommand } from './commands/merge-video.ts';
import { removeBackgroundCommand } from './commands/remove-background.ts';
import { requestBgmCommand } from './commands/request-bgm.ts';
import { requestCharacterCommand } from './commands/request-character.ts';
import { requestCharacterOrStyleCommand } from './commands/request-character-or-style.ts';
import { searchTcpCommand } from './commands/search-tcp.ts';

// Load environment variables
dotenv.config();

const program = new Command();

program.name('neta').description('NETA CLI - Neta API Client').version('0.1.0');

// Register commands
program.addCommand(makeImageCommand);
program.addCommand(makeVideoCommand);
program.addCommand(makeSongCommand);
program.addCommand(removeBackgroundCommand);
program.addCommand(mergeVideoCommand);
program.addCommand(searchTcpCommand);
program.addCommand(requestCharacterCommand);
program.addCommand(requestCharacterOrStyleCommand);
program.addCommand(requestBgmCommand);
program.addCommand(getHashtagInfoCommand);
program.addCommand(getHashtagCharactersCommand);
program.addCommand(getHashtagCollectionsCommand);

program.parse();
