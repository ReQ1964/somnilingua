import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { getLanguageFlag } from '@/lib/language-flags.ts';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageResponse } from '@/api';
import { useTranslation } from 'react-i18next';
import LanguagePickerSkeleton from '@/components/add-language-dialog/skeletons/language-picker-skeleton.tsx';
import ErrorState from '@/components/error-state.tsx';

interface LanguagePickerProps {
  languages?: LanguageResponse[];
  languagesIsLoading: boolean;
  languagesIsError: boolean;
  onRetry: () => void;
}

const LanguagePicker = ({
  languages,
  languagesIsLoading,
  languagesIsError,
  onRetry,
}: LanguagePickerProps) => {
  const [comboOpen, setComboOpen] = useState(false);
  const { t } = useTranslation();
  const { control } = useFormContext();
  const languageList = languages ?? [];

  return (
    <motion.div
      key="s1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <p className="text-sm text-muted-foreground mb-3">
        {t('addLang.pickLang')}
      </p>

      {languagesIsError ? (
        <ErrorState
          title={t('addLang.errors.loadLanguages.title')}
          message={t('addLang.errors.loadLanguages.message')}
          retryLabel={t('addLang.errors.retry')}
          onRetry={onRetry}
        />
      ) : (
        <Controller
          control={control}
          name="languageId"
          render={({ field }) => (
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <button className="w-full border rounded-md px-3 py-2 text-left" type="button">
                  {field.value ? (
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-xl">
                        {getLanguageFlag(
                          languageList.find((item) => item.id === field.value)?.code,
                        )}
                      </span>
                      {languageList.find((l) => l.id === field.value)?.name}
                    </span>
                  ) : (
                    t('addLang.selectLanguage')
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <CommandInput placeholder={t('addLang.pickLangPh')} />

                  <CommandList>
                    {languagesIsLoading ? (
                      <LanguagePickerSkeleton />
                    ) : (
                      <>
                        <CommandEmpty>{t('addLang.noResults')}</CommandEmpty>

                        <CommandGroup>
                          {languageList.map((l) => (
                            <CommandItem
                              key={l.id}
                              value={`${l.name} ${l.id}`}
                              onSelect={() => {
                                field.onChange(l.id);
                                setComboOpen(false);
                              }}
                            >
                              <span className="text-lg mr-2">
                                {getLanguageFlag(l.code)}
                              </span>
                              <span className="flex-1">{l.name}</span>

                              {field.value === l.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        />
      )}
    </motion.div>
  );
};

export default LanguagePicker;
